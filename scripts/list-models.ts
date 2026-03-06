import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    try {
        const models = await (genAI as any).apiKey ? fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`).then(res => res.json()) : {};
        console.log(JSON.stringify(models, null, 2));
    } catch (e) { console.error(e); }
}
list();
