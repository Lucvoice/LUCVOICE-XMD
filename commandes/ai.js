const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "ai",
    categorie: "AI",
    reaction: "🤖",
    desc: "Simple AI chatbot"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("🤖 Please type a message!\nExample: .ai hello");
    }

    const query = arg.join(" ").toLowerCase();

    // simple AI responses
    let reply;

    if (query.includes("hello") || query.includes("hi")) {
        reply = "👋 Hello! I am your AI assistant. How can I help you?";
    }
    else if (query.includes("how are you")) {
        reply = "🤖 I'm fine and always active! Thanks for asking 😊";
    }
    else if (query.includes("who are you")) {
        reply = "🤖 I am LUCVOICE-XMD AI assistant created by LUKA iT 🚀";
    }
    else if (query.includes("bot")) {
        reply = "🤖 Yes, I am a WhatsApp bot powered by Node.js ⚡";
    }
    else if (query.includes("love")) {
        reply = "❤️ Love is beautiful! Stay positive and kind 😊";
    }
    else {
        reply = "🤖 I don't fully understand yet, but I'm learning... 🚀";
    }

    await repondre(reply);
});
