const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

// ⚠️ Replace with your real OpenAI API key
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

zokou({ nomCom: "gpt", categorie: "AI" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || arg.length === 0) {
            return repondre("❌ Tumia: .gpt <swali lako>");
        }

        let prompt = arg.join(" ");

        repondre("🤖 Thinking...");

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful WhatsApp assistant for LUCVOICE-XMD bot."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                }
            }
        );

        let answer = response.data.choices[0].message.content;

        return repondre(
            `🤖 *GPT RESPONSE*\n\n` +
            `${answer}`
        );

    } catch (e) {
        console.log("GPT Error:", e.response?.data || e.message);
        repondre("❌ GPT error occurred. Check API key or internet.");
    }
});
