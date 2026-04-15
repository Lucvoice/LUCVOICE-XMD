const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "apk",
    categorie: "Download",
    reaction: "📥",
    desc: "Search and download APK apps"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("❌ Please enter an app name!\nExample: .apk WhatsApp");
    }

    const query = arg.join(" ");

    try {
        const url = `https://ws75.aptoide.com/api/7/apps/search?query=${query}`;

        const response = await axios.get(url);
        const results = response.data.datalist.list;

        if (!results || results.length === 0) {
            return repondre("❌ No APK found for: " + query);
        }

        let message = `╭━━〔 📥 APK SEARCH 〕━━╮
┃ 🔎 Query: ${query}
┃ 📦 Results found: ${results.length}
╰━━━━━━━━━━━━━━━━━━╯\n`;

        // show top 5 results
        let limit = results.slice(0, 5);

        limit.forEach((app, i) => {
            message += `
╭──〔 ${i + 1} 〕──╮
┃ 📱 Name : ${app.name}
┃ 📦 Package : ${app.package}
┃ ⭐ Rating : ${app.stats.rating}
┃ 📥 Download: ${app.file.path}
╰──────────────╯\n`;
        });

        message += `
💡 Type: .apk app name
⚡ Powered by LUCVOICE-XMD`;

        await zk.sendMessage(dest, { text: message }, { quoted: ms });

    } catch (error) {
        console.log("APK error:", error);
        repondre("❌ Error fetching APK data. Try again later.");
    }
});
