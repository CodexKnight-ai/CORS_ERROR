// import { NextResponse } from 'next/server';
// import { supabase } from '@/app/lib/supabase';
// import { pipeline, env } from '@huggingface/transformers';
// import path from 'path';
// import { jobsData } from '@/app/api/data/jobsData';

// env.cacheDir = path.join(process.cwd(), '.cache');

// export async function GET() {
//     console.log("Seed route called");
//     let extractor;

//     try {
//         // Ensure this matches the vector(384) in your SQL. 
//         // If you use Bio_ClinicalBERT, change the model name and update SQL to vector(768).
//         extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
//             dtype: 'q8',
//             cache_dir: path.join(process.cwd(), '.cache')
//         });
//     } catch (err: any) {
//         console.error("Pipeline error:", err);
//         return NextResponse.json({ error: `Pipeline initialization failed: ${err.message}` }, { status: 500 });
//     }

//     console.log("Extractor created. Processing roles...");

//     try {
//         const rows = await Promise.all(jobsData.map(async (job) => {
//             const textToEmbed = `${job.field_name}: ${job.field_description}`;
//             const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });

//             return {
//                 id: job.id,
//                 category: job.category,
//                 subdomain: job.subdomain,
//                 field_name: job.field_name,
//                 field_description: job.field_description,
//                 skills_required: job.skills_required,
//                 skills_breakdown: job.skills_breakdown, // JSONB
//                 keywords: job.keywords,
//                 prerequisites: job.prerequisites,
//                 learning_path: job.learning_path,       // JSONB
//                 tools_required: job.tools_required,
//                 certifications: job.certifications,
//                 avg_salary_inr: job.avg_salary_inr,
//                 salary_range_inr: job.salary_range_inr,
//                 entry_level: job.entry_level,
//                 mid_level: job.mid_level,
//                 senior_level: job.senior_level,
//                 demand_growth_2026: job.demand_growth_2026,
//                 entry_level_duration: job.entry_level_duration,
//                 career_progression: job.career_progression,
//                 next_roles: job.next_roles,
//                 interests_matching: job.interests_matching,
//                 similar_roles: job.similar_roles,
//                 industry_focus: job.industry_focus,
//                 remote_friendly: job.remote_friendly,
//                 job_market_saturation: job.job_market_saturation,
//                 growth_potential_rating: job.growth_potential_rating,
//                 difficulty_rating: job.difficulty_rating,
//                 typical_companies: job.typical_companies,
//                 embedding: Array.from(output.data)
//             };
//         }));

//         console.log(`Prepared ${rows.length} rows. Upserting to job_roles...`);

//         const { error } = await supabase.from('job_roles').upsert(rows);

//         if (error) {
//             console.error("Supabase Upsert Error:", error);
//             throw error;
//         }

//         return NextResponse.json({
//             message: `Successfully seeded ${rows.length} roles with full metadata!`
//         });

//     } catch (err: any) {
//         console.error("Seeding failed:", err);
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }