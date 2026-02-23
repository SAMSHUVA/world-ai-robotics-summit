require("dotenv").config({ path: ".env.local" });

async function testHFOpenAI() {
    console.log("Starting OpenAI-compatible fetch test...");
    const token = process.env.HUGGINGFACE_API_KEY;

    // Test with a good free model
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    model: "mistralai/Mistral-7B-Instruct-v0.2",
                    messages: [
                        { role: "user", content: "Write a 2 sentence summary of agriculture robotics." }
                    ],
                    max_tokens: 200
                }),
            }
        );

        const result = await response.json();
        console.log("Status:", response.status);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testHFOpenAI();
