const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require("../set");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const OWNER_NAME = "LUKA iT"; 
const FOOTER_TEXT = "𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 " + OWNER_NAME;

const ABOUT_IMAGE = "https://files.catbox.moe/t21l69.png";

zokou({
    nomCom: "about",
    categorie: "General",
    reaction: "ℹ️",
    desc: "Show bot information"
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
╭━━〔 🤖 ABOUT BOT 〕━━╮
┃ 🤖 Name    : ${BOT_NAME}
┃ 👑 Owner   : ${OWNER_NAME}
┃ ⚡ Version : 1.0.0
┃ 🌐 Mode    : ${s.MODE}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 💻 SYSTEM INFO 〕━━╮
┃ 💾 RAM     : ${ram} MB
┃ 🧠 CPU     : ${cpu}
┃ ⏱ Uptime  : ${h}h ${m}m ${s2}s
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 📅 TIME INFO 〕━━╮
┃ ⏰ Time : ${time}
┃ 📅 Date : ${date}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 ✨ DESCRIPTION 〕━━╮
┃ 🚀 Powerful WhatsApp Bot
┃ 🔥 Fast & Stable System
┃ 🛠 Built with Node.js & Baileys
┃ 💡 Created by ${OWNER_NAME}
╰━━━━━━━━━━━━━━━━━━╯

${FOOTER_TEXT}
`;

    try {
        await zk.sendMessage(dest, {
            image: { url: ABOUT_IMAGE },
            caption: message
        }, { quoted: ms });
    } catch (e) {
        console.log("About error:", e);
        repondre(message);
    }
});lako
