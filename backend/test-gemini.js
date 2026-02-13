import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAPI() {
    try {
        console.log('Testing API key...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? 'Loaded' : 'NOT LOADED');

        // Try to list models
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Say 'Hello World' in one word";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ API KEY WORKS!');
        console.log('Response:', text);
    } catch (error) {
        const fs = await import('fs');
        const errorReport = `❌ API KEY ERROR:
Error message: ${error.message}
Error status: ${error.status}
Error details: ${JSON.stringify(error.errorDetails, null, 2)}
Full error: ${JSON.stringify(error, null, 2)}
`;
        console.log(errorReport);
        fs.writeFileSync('gemini-error.txt', errorReport);
        console.log('\nError details saved to gemini-error.txt');
    }
}

testAPI();
