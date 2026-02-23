require("dotenv").config({ path: ".env.local" });
const { HfInference } = require("@huggingface/inference");

async function testHF() {
    console.log("Starting test with key:", process.env.HUGGINGFACE_API_KEY ? "Loaded" : "Missing");

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Test 1: textGeneration with Mistral 7B
    try {
        const model1 = "mistralai/Mistral-7B-Instruct-v0.2";
        console.log(`\nTesting textGeneration with ${model1}...`);
        const response1 = await hf.textGeneration({
            model: model1,
            inputs: "[INST] Write a 2 sentence summary of agriculture robotics. [/INST]",
            parameters: { max_new_tokens: 100 }
        });
        console.log("SUCCESS TEXT_GEN!", response1.generated_text);
    } catch (e) {
        console.error("FAIL TEXT_GEN:", e.message);
    }

    // Test 2: chatCompletion with Qwen
    try {
        const model2 = "Qwen/Qwen2.5-72B-Instruct";
        console.log(`\nTesting chatCompletion with ${model2}...`);
        const response2 = await hf.chatCompletion({
            model: model2,
            messages: [{ role: "user", content: "Write a 2 sentence summary of agriculture robotics." }],
            max_tokens: 100
        });
        console.log("SUCCESS CHAT_COMP!", response2.choices[0].message.content);
    } catch (e) {
        console.error("FAIL CHAT_COMP:", e.message);
    }
}

testHF();
