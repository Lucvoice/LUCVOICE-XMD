const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require("../set");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const OWNER_NAME = "LUKA iT";

const DEPLOY_IMAGE = "https://files.catbox.moe/277zt9.jpg";

zokou({
    nomCom: "deploy",
    categorie: "System",
    reaction: "🚀",
    desc: "Show bot deployment information"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s2 = Math.floor(uptime % 60);

    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0].model;

    const message = `
╭━━〔 🚀 DEPLOY INFO 〕━━╮
┃ 🤖 Bot Name : ${BOT_NAME}
┃ 👑 Owner     : ${OWNER_NAME}
┃ 🌐 Mode      : ${s.MODE}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 💻 SYSTEM INFO 〕━━╮
┃ 💾 RAM       : ${ram} MB
┃ 🧠 CPU       : ${cpu}
┃ ⏱ Uptime    : ${h}h ${m}m ${s2}s
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 📅 TIME INFO 〕━━╮
┃ ⏰ Time : ${time}
┃ 📅 Date : ${date}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🚀 DEPLOY PLATFORM 〕━━╮
┃ 🔹 Node.js Bot System
┃ 🔹 WhatsApp Baileys
┃ 🔹 Stable & Fast Server
┃ 🔹 Auto Restart Enabled
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 👑 DEVELOPER 〕━━╮
┃ 💡 Created by: ${OWNER_NAME}
┃ ⚡ Powered by: LUCVOICE-XMD
╰━━━━━━━━━━━━━━━━━━╯
`;

    try {
        await zk.sendMessage(dest, {
            image: { url: DEPLOY_IMAGE },
            caption: message
        }, { quoted: ms });
    } catch (e) {
        console.log("Deploy error:", e);
        repondre(message);
    }
});
