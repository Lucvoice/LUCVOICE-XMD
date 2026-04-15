const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require("../set");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const OWNER_NAME = "LUKA iT";
const FOOTER_TEXT = "𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 " + OWNER_NAME;

// Alive image
const ALIVE_IMAGE = "https://files.catbox.moe/t21l69.png";

zokou({
    nomCom: "alive",
    categorie: "General",
    reaction: "💚",
    desc: "Check if bot is alive"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // uptime
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s2 = Math.floor(uptime % 60);

    // RAM usage
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const message = `
╭━━〔 💚 ALIVE STATUS 〕━━╮
┃ 🤖 Bot Name : ${BOT_NAME}
┃ 👑 Owner    : ${OWNER_NAME}
┃ ⚡ Status    : ONLINE ✅
┃ 🌐 Mode     : ${s.MODE}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 💻 SYSTEM INFO 〕━━╮
┃ 💾 RAM      : ${ram} MB
┃ ⏱ Uptime   : ${h}h ${m}m ${s2}s
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 📅 TIME INFO 〕━━╮
┃ ⏰ Time : ${time}
┃ 📅 Date : ${date}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🚀 STATUS MESSAGE 〕━━╮
┃ ✅ Bot is running smoothly
┃ ⚡ No errors detected
┃ 🔥 System stable and active
╰━━━━━━━━━━━━━━━━━━╯

${FOOTER_TEXT}
`;

    try {
        await zk.sendMessage(dest, {
            image: { url: ALIVE_IMAGE },
            caption: message
        }, { quoted: ms });
    } catch (e) {
        console.log("Alive error:", e);
        repondre(message);
    }
});
