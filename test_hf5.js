require("dotenv").config({ path: ".env.local" });

async function testHFRouter() {
    console.log("Starting HF Router test...");
    const token = process.env.HUGGINGFACE_API_KEY;

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    model: "HuggingFaceH4/zephyr-7b-beta",
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

testHFRouter();
