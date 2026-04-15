const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "tts", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || arg.length === 0) {
            return repondre("❌ Tumia: .tts <text>\nMfano: .tts Hello LUCVOICE");
        }

        let text = arg.join(" ");

        repondre("🔊 Converting text to speech...");

        // Google TTS free API
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;

        await zk.sendMessage(dest, {
            audio: { url: url },
            mimetype: "audio/mp4",
            ptt: true // voice note style
        }, { quoted: ms });

    } catch (e) {
        console.log("TTS error:", e);
        repondre("❌ Error kwenye TTS command");
    }
});
