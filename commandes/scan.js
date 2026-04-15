const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const OWNER_NAME = "LUKA iT";

const SCAN_IMAGE = "https://files.catbox.moe/t21l69.png";

zokou({
    nomCom: "scan",
    categorie: "System",
    reaction: "📲",
    desc: "Show bot scan/pairing info"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    const message = `
╭━━〔 📲 SCAN SESSION 〕━━╮
┃ 🤖 Bot : ${BOT_NAME}
┃ 👑 Owner : ${OWNER_NAME}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🔐 PAIRING INFO 〕━━╮
┃ 📌 Open pairing link
┃ 📲 Scan QR code to login
┃ ⚡ Keep session safe
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 ⚠️ IMPORTANT 〕━━╮
┃ ❗ Do not share session code
┃ 🔐 Keep your bot secure
┃ 🚀 Restart if login fails
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 📅 INFO 〕━━╮
┃ ⏰ Time : ${time}
┃ 📅 Date : ${date}
╰━━━━━━━━━━━━━━━━━━╯

💡 Powered by ${OWNER_NAME}
`;

    try {
        await zk.sendMessage(dest, {
            image: { url: SCAN_IMAGE },
            caption: message
        }, { quoted: ms });
    } catch (e) {
        console.log("Scan error:", e);
        repondre(message);
    }
});
