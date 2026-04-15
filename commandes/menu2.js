const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");

zokou({ nomCom: "menu2", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, prefixe, repondre } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    try {
        moment.tz.setDefault("Africa/Dar_es_Salaam");

        let time = moment().format("HH:mm:ss");
        let date = moment().format("DD/MM/YYYY");

        let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        // GROUP COMMANDS
        let commands = {};
        cm.forEach(cmd => {
            if (!commands[cmd.categorie]) commands[cmd.categorie] = [];
            commands[cmd.categorie].push(cmd.nomCom);
        });

        let header = `
╭━━〔 🤖 LUCVOICE-XMD MENU 〕━━╮
┃ 📅 Date : ${date}
┃ ⏰ Time : ${time}
┃ 💾 RAM  : ${ram} MB
┃ ⚡ Mode : ACTIVE
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

        let body = "";

        for (let cat in commands) {
            body += `\n╭──〔 ${cat.toUpperCase()} 〕──╮\n`;
            commands[cat].forEach(cmd => {
                body += `│ ➤ ${prefixe}${cmd}\n`;
            });
            body += `╰──────────────╯\n`;
        }

        let footer = `
🚀 *LUCVOICE-XMD BOT*
💡 Type commands to interact
🔥 Fast | Smart | AI Ready
`;

        let imageUrl = "https://files.catbox.moe/8a9abd.png";

        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: header + body + footer
        }, { quoted: ms });

    } catch (e) {
        console.log("Menu2 error:", e);
        repondre("❌ Error loading menu2");
    }
});
