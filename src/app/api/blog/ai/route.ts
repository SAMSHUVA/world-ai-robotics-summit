import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

export async function POST(request: Request) {
    if (!process.env.GOOGLE_AI_KEY && !process.env.HUGGINGFACE_API_KEY) {
        return NextResponse.json({ error: 'Neither GOOGLE_AI_KEY nor HUGGINGFACE_API_KEY is configured in .env' }, { status: 500 });
    }

    try {
        console.log("RUNTIME ENV URL:", process.env.DATABASE_URL);

        const sessions = [
            "Session 1: Precision Agriculture & Smart Farming (data, sensors, analytics)",
            "Session 2: Artificial Intelligence & Machine Learning in Agriculture (next-gen AI tools, automation)",
            "Session 3: Sustainable & Climate-Smart Agriculture (environmental resilience)",
            "Session 4: Robotics, Automation & Autonomous Systems (hardware, robotics)",
            "Session 5: AgTech Market Dynamics & Innovation Ecosystems (market trends, investments)",
            "Session 6: Emerging Technologies & Future Horizons (cutting-edge research)"
        ];

        const randomSession = sessions[Math.floor(Math.random() * sessions.length)];

        const prompt = `
            You are a tech journalist and content writer for a world-class robotics and AI summit.
            Write a high-quality, professional, and SEO-optimized blog post focused strictly on the following conference track:
            "${randomSession}"
            
            Focus on recent trends, innovations, and breakthroughs for the year 2025 and 2026 related specifically to this topic. 
            The content MUST be highly unique each time. Do not use generic headers or repetitive phrasing.
            At the end of the post, add a compelling call to action (CTA) in its own paragraph, mentioning that industry leaders will dive deeply into this exact topic during ${randomSession.split(' (')[0]} at our upcoming summit.
            
            The response MUST be a VALID JSON object with the following fields:
            {
                "title": "A highly unique, compelling, catchy title for the post (must be different each time)",
                "excerpt": "A short, engaging summary (max 160 characters) for the blog listing",
                "category": "One of: Technology, Sustainability, Innovation, AI, or Robotics",
                "content": "The full blog post content in high-quality HTML format (including <h2>, <p>, <ul>, and the CTA at the end)",
                "readTime": "Estimated read time, e.g., '5 min'"
            }
            
            Ensure the content is insightful, technical yet accessible. Do not include any markdown code blocks (like \`\`\`json) in the response, just the raw JSON string.
        `;

        const FALLBACK_MODELS = [
            "gemini-1.5-flash", // 1500 requests per day for free
            "gemini-1.5-pro",   // 50 requests per day for free
        ];

        let text = "";
        let usedModel = "";
        let geminiSuccess = false;

        // Try Gemini models first if key is available
        if (process.env.GOOGLE_AI_KEY) {
            for (const modelName of FALLBACK_MODELS) {
                try {
                    console.log(`Trying Gemini model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    text = response.text();
                    usedModel = modelName;
                    geminiSuccess = true;
                    break; // Success, exit Gemini loop
                } catch (err: any) {
                    console.warn(`Gemini model ${modelName} failed:`, err.message);
                    continue; // Try next Gemini model
                }
            }
        }

        // Fallback to Hugging Face if Gemini failed or key is missing
        if (!geminiSuccess && process.env.HUGGINGFACE_API_KEY) {
            try {
                const hfModel = "Qwen/Qwen2.5-72B-Instruct";
                console.log(`Gemini failed, trying Hugging Face fallback: ${hfModel}`);

                const response = await hf.chatCompletion({
                    model: hfModel,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 2000,
                    temperature: 0.7,
                });

                if (response.choices && response.choices.length > 0) {
                    text = response.choices[0].message.content || "";
                    usedModel = "HuggingFace (Qwen 2.5)";
                }
            } catch (err: any) {
                console.error("Hugging Face API Error:", err.message);
                if (err.message.includes("403") || err.message.includes("Failed to perform")) {
                    throw new Error("Hugging Face API key is invalid or lacks 'Inference' permissions. Please recreate the token and ensure 'Make calls to the Serverless Inference API' is checked.");
                }
            }
        }

        if (!text) {
            throw new Error("All available AI models (Gemini & Hugging Face) failed due to quota limits, high demand, or unavailability. Please try again later.");
        }

        // More robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not find JSON object in AI response");
        }

        const aiData = JSON.parse(jsonMatch[0]);

        // Generate slug
        const slug = aiData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Save as Draft
        const post = await prisma.blogPost.create({
            data: {
                title: aiData.title,
                excerpt: aiData.excerpt,
                category: aiData.category,
                content: aiData.content,
                readTime: aiData.readTime || "5 min",
                slug: `${slug}-${Math.floor(Math.random() * 10000)}`,
                author: "Gemini AI",
                isPublished: false, // AI posts start as drafts
                aiSummary: `Generated by ${usedModel.toUpperCase()} explicitly based on current AgTech trends.`,
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" // Default high-tech placeholder
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        if (error instanceof Error && error.message.includes('503')) {
            return NextResponse.json({
                error: 'AI API Overloaded',
                details: 'Google Gemini is currently experiencing a temporary spike in traffic. Please wait a moment and try generating again.'
            }, { status: 503 });
        }
        if (error instanceof Error && error.message.includes('429')) {
            return NextResponse.json({
                error: 'AI Quota Exceeded',
                details: 'You have hit the Google AI rate limit. Please wait 1-2 minutes before trying again, or check your quota in Google AI Studio.'
            }, { status: 429 });
        }
        return NextResponse.json({
            error: 'Failed to generate AI blog post',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
