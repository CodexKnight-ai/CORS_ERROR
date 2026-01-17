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

        // 1. Prepare User Evidence
        const userEvidence = [
            ...body.skills.map((s: string) => ({ text: s, type: 'explicit' })),
            ...body.projects.map((p: any) => ({ text: `${p.name}: ${p.description}`, type: 'project' })),
            ...body.education.map((e: any) => ({ text: `${e.degree} at ${e.institution}`, type: 'academic' })),
            ...body.achievements.map((a: any) => ({ text: `${a.title}: ${a.description}`, type: 'achievement' }))
        ];

        const evidenceEmbeddings = await Promise.all(
            userEvidence.map(async (item) => {
                const out = await extractor(item.text, { pooling: 'mean', normalize: true });
                return { ...item, embedding: Array.from(out.data) as number[] };
            })
        );

        // 2. Global Search
        const globalText = userEvidence.map(e => e.text).join(' ');
        const globalOut = await extractor(globalText, { pooling: 'mean', normalize: true });
        const globalEmbedding = Array.from(globalOut.data) as number[];

        let { data: matches, error } = await supabase.rpc('match_jobs', {
            query_embedding: globalEmbedding,
            match_threshold: 0.1,
            match_count: 5
        });

        if (error) throw error;

        // 3. Process each match with BERT
        const finalResults = await Promise.all(matches.map(async (job: any) => {
            const categories = {
                foundational: job.skills_breakdown?.foundational || [],
                intermediate: job.skills_breakdown?.intermediate || [],
                advanced: job.skills_breakdown?.advanced || [],
                tools: job.tools_required || []
            };

            const recognized: string[] = [];
            const missing: string[] = [];

            // Analyze every required skill
            for (const section of Object.values(categories)) {
                for (const reqSkill of section) {
                    const reqOut = await extractor(reqSkill, { pooling: 'mean', normalize: true });
                    const reqVec = Array.from(reqOut.data) as number[];

                    let isFound = false;
                    for (const evidence of evidenceEmbeddings) {
                        const score = cosineSimilarity(reqVec, evidence.embedding);
                        if (score > 0.72) { // Semantic Match Threshold
                            isFound = true;
                            break;
                        }
                    }

                    if (isFound) recognized.push(reqSkill);
                    else missing.push(reqSkill);
                }
            }

            return {
                ...job,
                match_percentage: Math.round(job.similarity * 100),
                // --- THE NEW FIELDS ---
                missing_skills: [...new Set(missing)], // Flat array for easy listing
                recognized_skills: [...new Set(recognized)],
                // Detailed breakdown for the "Gap Analysis" UI
                gap_analysis: {
                    foundational_gaps: categories.foundational.filter((s: string) => missing.includes(s)),
                    intermediate_gaps: categories.intermediate.filter((s: string) => missing.includes(s)),
                    advanced_gaps: categories.advanced.filter((s: string) => missing.includes(s))
                }
            };
        }));

        return NextResponse.json(finalResults);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}