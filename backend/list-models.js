import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    try {
        console.log('Listing available models...');

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY
        );

        const data = await response.json();

        if (response.ok) {
            console.log('✅ API Key is valid!');
            console.log('\nAvailable models:');
            if (data.models) {
                data.models.forEach(model => {
                    console.log(`- ${model.name}`);
                    console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
                });
            } else {
                console.log('No models found in response:', data);
            }
        } else {
            console.log('❌ Error:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
