import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
});
const gptModel = "gpt-4";

export async function explainCode(codeToExplain, detector, callback) {
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
                    content: `Only answer with a single word "Yes" or "No", along with one relevant line of code (number).`
                },
                {
                    role: "user",
                    content:
                        `${detector}\n` +
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
