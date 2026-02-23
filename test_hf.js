require("dotenv").config({ path: ".env.local" });
const { HfInference } = require("@huggingface/inference");

async function testHF() {
    console.log("Starting test with key:", process.env.HUGGINGFACE_API_KEY ? "Loaded" : "Missing");

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const hfModel = "mistralai/Mixtral-8x7B-Instruct-v0.1";

    try {
        console.log(`Trying Hugging Face fallback: ${hfModel}`);

        const response = await hf.textGeneration({
            model: hfModel,
            inputs: "Write a 2 sentence summary of agriculture robotics.",
            parameters: {
                max_new_tokens: 200,
                temperature: 0.7,
                return_full_text: false,
            }
        });

        console.log("SUCCESS! Response:", response.generated_text);
    } catch (err) {
        console.error("Hugging Face API Error:", err.message);
        console.error("Full error details:", JSON.stringify(err, null, 2));
    }
}

testHF();
