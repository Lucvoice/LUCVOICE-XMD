const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    let mode = (s.MODE.toLowerCase() === "yes") ? "Public" : "Private";

    cm.map((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭━━〔 🤖 LUCVOICE-XMD 〕━━╮
┃ 👑 Owner   : ${s.OWNER_NAME || "Luka IT"}
┃ ⚡ Prefix  : ${s.PREFIXE}
┃ 🌐 Mode    : ${mode}
┃ 📅 Date    : ${date}
┃ ⏰ Time    : ${time}
┃ 💻 RAM     : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
╰━━━━━━━━━━━━━━━━━━╯
${readmore}
`;

    let menuMsg = "";
    for (let cat in coms) {
        menuMsg += `
╭───「 ${cat.toUpperCase()} 」───╮
│`;
        for (let cmd of coms[cat]) {
            menuMsg += `\n│ ➤ ${prefixe}${cmd}`;
        }
        menuMsg += `
│
╰───────────────╯`;
    }

    menuMsg += `
╭──────────────╮
│ 🚀 BOT STATUS: ONLINE
│ 💫 LUCVOICE-XMD
╰──────────────╯`;

    // ✅ Your image link
    let imageUrl = "https://files.catbox.moe/vhre8c.png";

    try {
        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: infoMsg + menuMsg
        }, { quoted: ms });
    } catch (e) {
        console.log("Menu error:", e);
        repondre("❌ Error sending menu");
    }
});
