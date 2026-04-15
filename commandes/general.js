const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");
const s = require("../set");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const OWNER_NAME = "LUKA iT";

// 📌 HELP / INFO COMMAND
zokou({
    nomCom: "help",
    categorie: "General",
    reaction: "📖",
    desc: "Show help info"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe } = commandeOptions;

    const message = `
╭━━〔 📖 HELP MENU 〕━━╮
┃ 🤖 Bot : ${BOT_NAME}
┃ 👑 Owner : ${OWNER_NAME}
┃ ⚡ Prefix : ${prefixe}
╰━━━━━━━━━━━━━━━━━━╯

📌 Commands:
➤ ${prefixe}menu - Show main menu
➤ ${prefixe}alive - Check bot status
➤ ${prefixe}ping - Check speed
➤ ${prefixe}about - Bot info
➤ ${prefixe}apk - Download apps
➤ ${prefixe}deploy - Deployment info

💡 Use ${prefixe}menu for full commands list
`;

    await repondre(message);
});

// 📌 DATE COMMAND
zokou({
    nomCom: "date",
    categorie: "General",
    reaction: "📅",
    desc: "Show current date"
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    moment.tz.setDefault('Africa/Dar_es_Salaam');

    const date = moment().format('DD/MM/YYYY');
    const time = moment().format('HH:mm:ss');

    await repondre(`
📅 *CURRENT DATE & TIME*

🗓 Date: ${date}
⏰ Time: ${time}
`);
});

// 📌 BOT INFO COMMAND
zokou({
    nomCom: "info",
    categorie: "General",
    reaction: "ℹ️",
    desc: "Bot system info"
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const uptime = process.uptime();

    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s2 = Math.floor(uptime % 60);

    const cpu = os.cpus()[0].model;

    await repondre(`
╭━━〔 ℹ️ SYSTEM INFO 〕━━╮
┃ 🤖 Bot : ${BOT_NAME}
┃ 👑 Owner : ${OWNER_NAME}
┃ 💾 RAM : ${ram} MB
┃ 🧠 CPU : ${cpu}
┃ ⏱ Uptime : ${h}h ${m}m ${s2}s
╰━━━━━━━━━━━━━━━━━━╯
`);
});

// 📌 SPEED TEST SIMPLE
zokou({
    nomCom: "speed",
    categorie: "General",
    reaction: "⚡",
    desc: "Check bot speed"
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    const start = Date.now();
    await repondre("⚡ Testing speed...");
    const speed = Date.now() - start;

    await repondre(`
⚡ *SPEED TEST*

📊 Response Time: ${speed} ms
🚀 Status: FAST
`);
});
