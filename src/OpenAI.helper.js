import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: getConfigValue("credentials.openAiApiKey")
});
const gptModel = "gpt-4";