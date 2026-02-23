require("dotenv").config({ path: ".env.local" });

async function testHFDirect() {
    console.log("Starting direct fetch test...");
    const token = process.env.HUGGINGFACE_API_KEY;

    // Test with a very basic, always-available model: gpt2
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/gpt2",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: "Robots are" }),
            }
        );

        const result = await response.json();
        console.log("Status:", response.status);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testHFDirect();
