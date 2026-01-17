// import { NextResponse } from 'next/server';
// import { supabase } from '@/app/lib/supabase';
// import { pipeline, env } from '@huggingface/transformers';
// import path from 'path';
// import { jobsData } from '@/app/skill-gap/data.js';

// env.cacheDir = path.join(process.cwd(), '.cache');

// export async function GET() {
//     console.log("Seed route called");
//     console.log("Current cache dir:", env.cacheDir);
//     let extractor;
//     try {
//         extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
//             dtype: 'q8',
//             cache_dir: path.join(process.cwd(), '.cache')
//         });
//     } catch (err: any) {
//         console.error("Pipeline error:", err);
//         return NextResponse.json({ error: `Pipeline initialization failed: ${err.message}`, stack: err.stack }, { status: 500 });
//     }
//     console.log("Extractor created");
//     const rows = await Promise.all(jobsData.map(async (job) => {
//         const text = `${job.role}: ${job.description}`;
//         const output = await extractor(text, { pooling: 'mean', normalize: true });
//         console.log("Output created");
//         return {
//             role_name: job.role,
//             description: job.description,
//             embedding: Array.from(output.data) // Convert Tensor to Array
//         };
//     }));
//     console.log("Rows created");
//     const { error } = await supabase.from('job_roles').insert(rows);
//     console.log("Insertion completed");
//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json({ message: `Successfully seeded ${rows.length} roles!` });
// }