import OpenAI from "openai";

const gptModel = "gpt-4";

export async function explainCode(codeToExplain, detector, apiKey, callback) {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });

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
                    content: `Only answer with a single word "Yes" or "No", along with one relevant line of code (number). If your answer is "No", never add a line number.`
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

export async function explainCodeNoStream(codeToExplain, detector) {
    try {
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
    
        const noStream = await openai.chat.completions.create({
            frequency_penalty: 0,
            messages: [
                {
                    role: "system",
                    content: "You are an expert smart contract auditor."
                },
                {
                    role: "system",
                    content: `Only answer with a single word "Yes" or "No", along with one relevant line of code (number). If your answer is "No", never add a line number.`
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
            stream: false
        });

        return noStream.choices[0].message;
    } catch (e) {
        console.log(e);
    }
}
