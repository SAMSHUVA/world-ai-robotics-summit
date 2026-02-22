const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function run() {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyARhZ87Kb3pVtSjpYJnpDQLgO7srniUdXI");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Say 'Hello World' if you can read this.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        fs.writeFileSync('gemini_test_out.log', "SUCCESS: " + text);
    } catch (err) {
        fs.writeFileSync('gemini_test_out.log', "ERROR: " + err.message + "\n\nSTACK: " + err.stack);
    }
}

run();
