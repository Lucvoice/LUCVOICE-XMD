const { zokou } = require("../framework/zokou");

const OWNER_NAME = "LUKA iT";
const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";

zokou({
    nomCom: "contact",
    categorie: "General",
    reaction: "📞",
    desc: "Show bot owner contact"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    let infoMsg = `
╭━━〔 📞 CONTACT OWNER 〕━━╮
┃ 🤖 Bot Name : ${BOT_NAME}
┃ 👑 Owner    : ${OWNER_NAME}
╰━━━━━━━━━━━━━━━━━━╯

📌 *Owner Contact Info*

👤 Name   : ${OWNER_NAME}
📱 WhatsApp: +255768619068
📧 Email   : simkondalukas@gmail.com

━━━━━━━━━━━━━━━━━━

💡 *Support Available For:*
✔ Bot setup & configuration
✔ Bug fixing & errors
✔ Custom bot development
✔ Business inquiries

━━━━━━━━━━━━━━━━━━

⚡ Powered by ${OWNER_NAME}
`;

    await repondre(infoMsg);
});
