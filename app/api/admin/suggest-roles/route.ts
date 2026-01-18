import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { pipeline } from '@huggingface/transformers';

function cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return (magA === 0 || magB === 0) ? 0 : dotProduct / (magA * magB);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8' });

        // 1. ADVANCED CHUNKING: Creating "Micro-Contexts"
        // This ensures skills mentioned in passing within a 500-word description are caught.
        const userKnowledgeBase = [
            ...body.skills.map((s: string) => ({ text: s.toLowerCase() })),
            ...body.education.flatMap((e: any) => [
                { text: e.degree.toLowerCase() },
                { text: e.institution.toLowerCase() }
            ]),
            ...body.projects.flatMap((p: any) => [
                { text: p.name.toLowerCase() },
                { text: p.description.toLowerCase() },
                // Split description into sentences to boost focus on specific tool mentions
                ...p.description.split(/[.!?]/).filter((s: string) => s.length > 5).map((s: string) => ({ text: s.trim().toLowerCase() }))
            ]),
            ...body.achievements.map((a: any) => ({ text: `${a.title} ${a.description}`.toLowerCase() }))
        ];

        // Pre-calculate embeddings for micro-chunks
        const chunkEmbeddings = await Promise.all(
            userKnowledgeBase.map(async (chunk) => {
                const out = await extractor(chunk.text, { pooling: 'mean', normalize: true });
                return { ...chunk, embedding: Array.from(out.data) as number[] };
            })
        );

        // 2. Profile-to-Job Matching
        const globalProfileText = body.skills.join(' ') + ' ' + body.projects.map((p: any) => p.description).join(' ');
        const globalOut = await extractor(globalProfileText, { pooling: 'mean', normalize: true });
        const globalEmbedding = Array.from(globalOut.data) as number[];

        let { data: matches, error } = await supabase.rpc('match_jobs', {
            query_embedding: globalEmbedding,
            match_threshold: 0.01, // Very broad initial search
            match_count: 15
        });

        if (error) throw error;

        // 3. HYPER-SENSITIVE SKILL RECOGNITION
        const finalResults = await Promise.all(matches.map(async (job: any) => {
            const allReqs = [...new Set([
                ...(job.skills_breakdown?.foundational || []),
                ...(job.skills_breakdown?.intermediate || []),
                ...(job.skills_breakdown?.advanced || []),
                ...(job.tools_required || []),
                ...(job.required_skills || [])
            ])];

            const recognized: string[] = [];
            const missing: string[] = [];

            for (const reqSkill of allReqs) {
                const reqLower = reqSkill.toLowerCase();
                const reqOut = await extractor(reqSkill, { pooling: 'mean', normalize: true });
                const reqVec = Array.from(reqOut.data) as number[];

                let isFound = false;

                for (const chunk of chunkEmbeddings) {
                    // TIER 1: Direct or Substring Match (e.g., "React" found in "React.js Developer")
                    if (chunk.text.includes(reqLower) || reqLower.includes(chunk.text)) {
                        isFound = true;
                        break;
                    }

                    // TIER 2: Aggressive Semantic Match
                    // Lowered to 0.60 to capture related concepts (e.g., "Git" matching "Version Control")
                    const score = cosineSimilarity(reqVec, chunk.embedding);
                    if (score > 0.60) {
                        isFound = true;
                        break;
                    }
                }

                if (isFound) recognized.push(reqSkill);
                else missing.push(reqSkill);
            }

            return {
                ...job,
                // Recalculate match percentage based on the actual skill discovery
                match_percentage: Math.round((recognized.length / (recognized.length + missing.length)) * 100),
                recognized_skills: recognized,
                missing_skills: missing,
                gap_analysis: {
                    foundational_gaps: (job.skills_breakdown?.foundational || []).filter((s: string) => missing.includes(s)),
                    intermediate_gaps: (job.skills_breakdown?.intermediate || []).filter((s: string) => missing.includes(s)),
                    advanced_gaps: (job.skills_breakdown?.advanced || []).filter((s: string) => missing.includes(s))
                }
            };
        }));

        return NextResponse.json(
            finalResults.sort((a, b) => b.match_percentage - a.match_percentage).slice(0, 7)
        );

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}