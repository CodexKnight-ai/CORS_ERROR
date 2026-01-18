// import { NextResponse } from 'next/server';
// import { supabase } from '@/app/lib/supabase';
// import { pipeline, env } from '@huggingface/transformers';
// import path from 'path';
// import { coursesData } from '@/app/api/data/coursesData';

// env.cacheDir = path.join(process.cwd(), '.cache');

// export async function GET() {
//     try {
//         const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
//             dtype: 'q8',
//             cache_dir: path.join(process.cwd(), '.cache')
//         });

//         // --- STEP 1: DE-DUPLICATE DATA ---
//         // This ensures Postgres only sees each title once per request
//         const uniqueCourses = Array.from(
//             new Map(coursesData.map(item => [item.title, item])).values()
//         );

//         console.log(`Original: ${coursesData.length}, Unique: ${uniqueCourses.length}`);

//         const rows = await Promise.all(uniqueCourses.map(async (course) => {
//             const textToEmbed = `${course.title}: ${course.description}`;
//             const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });

//             return {
//                 title: course.title,
//                 partner: course.partner,
//                 description: course.description,
//                 image_url: course.imageUrl,
//                 link: course.link,
//                 embedding: Array.from(output.data)
//             };
//         }));

//         // --- STEP 2: UPSERT ---
//         const { error } = await supabase
//             .from('coursera_courses')
//             .upsert(rows, { onConflict: 'title' });

//         if (error) throw error;

//         return NextResponse.json({
//             success: true,
//             message: `Processed ${uniqueCourses.length} unique courses.`
//         });

//     } catch (err: any) {
//         console.error("Seeding error:", err);
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }