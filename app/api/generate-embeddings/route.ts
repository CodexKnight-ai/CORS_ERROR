import { NextResponse } from 'next/server';
import { pipeline } from '@huggingface/transformers';
// Import your existing data.js file
import {jobsData} from '../../skill-gap/data.js';

export async function GET() {
    try {
        console.log(`Generating embeddings for ${jobsData.length} roles...`);

        // 1. Initialize the Feature Extraction pipeline
        // We use the Xenova-version of Bio_ClinicalBERT which is optimized for JS
        const extractor = await pipeline('feature-extraction', 'Xenova/Bio_ClinicalBERT', {
            dtype: 'q8',
        });

        const processedData = await Promise.all(jobsData.map(async (item) => {
            const textToEmbed = `${item.role}: ${item.description}`;

            // 2. Generate the embedding
            const output = await extractor(textToEmbed, {
                pooling: 'mean',
                normalize: true
            });

            // 3. Convert the tensor to a standard JavaScript array
            const embeddingArray = Array.from(output.data);

            return {
                role: item.role,
                description: item.description,
                embedding: embeddingArray
            };
        }));

        // In a real app, you might save this to a database here.
        // For now, we return it as a JSON response.
        return NextResponse.json(processedData);

    } catch (error) {
        console.error("Embedding Error:", error);
        return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
    }
}