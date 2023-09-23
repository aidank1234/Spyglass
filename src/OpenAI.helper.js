import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
});
const gptModel = "gpt-4";

export async function explainCode(codeToExplain, callback) {
    try {
        const stream = await openai.chat.completions.create({
            frequency_penalty: 0,
            messages: [
                {
                    role: "system",
                    content: "You are an expert smart contract auditor."
                },
                {
                    role: "system",
                    content: "Be concise in your response and as brief as possible."
                },
                {
                    role: "user",
                    content:
                        "Explain what the following Solidity code does, adding any relevant" +
                        " comments about potential security flaws, if any exist:\n" +
                        codeToExplain
                }
            ],
            model: gptModel,
            presence_penalty: 0,
            temperature: 0,
            top_p: 1,
            stream: true
        });

        for await (const part of stream) {
            callback(part.choices[0].delta.content);
        }
    } catch (e) {
        console.log(e);
    }
}
