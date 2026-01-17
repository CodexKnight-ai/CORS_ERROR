import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { pipeline } from '@huggingface/transformers';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Convert complex JSON into a rich text string for the AI
        const userText = [
            `Skills: ${body.skills.join(', ')}.`,
            `Education: ${body.education.map((e: any) => `${e.degree} from ${e.institution}`).join('; ')}.`,
            `Projects: ${body.projects.map((p: any) => `${p.name}: ${p.description}`).join('; ')}.`,
            `Achievements: ${body.achievements.map((a: any) => `${a.title}: ${a.description}`).join('; ')}.`
        ].join(' ');

        // 2. Vectorize the formatted text
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8' });
        const output = await extractor(userText, { pooling: 'mean', normalize: true });
        const userEmbedding = Array.from(output.data);

        // 3. Match against Supabase
        let { data: matches, error } = await supabase.rpc('match_jobs', {
            query_embedding: userEmbedding,
            match_threshold: 0.3, // Lowered threshold since complex text has more variance
            match_count: 5
        });

        // 4. Ensure at least 3 results
        if (!matches || matches.length < 3) {
            const { data: fallback } = await supabase.rpc('match_jobs', {
                query_embedding: userEmbedding,
                match_threshold: 0,
                match_count: 3
            });
            matches = fallback;
        }

        if (error) throw error;
        return NextResponse.json(matches);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}