const { zokou } = require("../framework/zokou");
const s = require("../set");
const fs = require('fs-extra');
const moment = require("moment-timezone");

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const FOOTER_TEXT = "𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐋𝐮𝐤𝐚 𝐈𝐓";

// Single image for the menu
const MENU_IMAGE = "https://files.catbox.moe/277zt9.jpg";

zokou({
    nomCom: "sila",
    categorie: "General",
    reaction: "🔥",
    desc: "Display Sila Tech information and links"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, mybotpic, superUser, verifGroupe, nomAuteurMessage, prefixe } = commandeOptions;
    
    moment.tz.setDefault('Etc/GMT');
    const date = moment().format('DD/MM/YYYY');
    const time = moment().format('HH:mm:ss');
    
    // Links data
    const links = {
        // WhatsApp Channels
        main: "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02",
        stb: "https://whatsapp.com/channel/0029Vb7CLKM5vKAHHK9sR02z",
        logo: "https://whatsapp.com/channel/0029VbBmFT430LKO7Ch9C80X",
        
        // Groups
        botUser: "https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks",
        silaTech: "https://chat.whatsapp.com/HQelkrIlezV4etqxmT61pF",
        
        // Other
        heroku: "https://dashboard.heroku.com/new?template=",
        github: "https://github.com/Sila-Md/SILA-MD",
        telegramChannel: "https://t.me/sila_tech2",
        telegramGroup: "https://t.me/sila_md"
    };
    
    const message = `╭──────────────────╮
│   🔥 *SILA TECH* 🔥   │
│   ${BOT_NAME}   │
╰──────────────────╯

╔══════════════════╗
║  📢 *WHATSAPP CHANNELS*  ║
╠══════════════════╣
║  🔹 *MAIN CHANNEL*
║     ${links.main}
║
║  🔹 *STB CHANNEL*
║     ${links.stb}
║
║  🔹 *LOGO CHANNEL*
║     ${links.logo}
╠══════════════════╣
║  👥 *GROUPS*        ║
╠══════════════════╣
║  🔹 *BOT USER GROUP*
║     ${links.botUser}
║
║  🔹 *SILA TECH GROUP*
║     ${links.silaTech}
╠══════════════════╣
║  🔗 *OTHER LINKS*    ║
╠══════════════════╣
║  🔹 *HEROKU DEPLOY*
║     ${links.heroku}
║
║  🔹 *GITHUB*
║     ${links.github}
║
║  🔹 *TELEGRAM CHANNEL*
║     ${links.telegramChannel}
║
║  🔹 *TELEGRAM GROUP*
║     ${links.telegramGroup}
╚══════════════════╝

╭──────────────────╮
│  📅 *${date}*  ⏰ *${time}*  │
│  🔥 *SILA TECH* 🔥  │
╰──────────────────╯

${FOOTER_TEXT}`;

    // Send with single image
    try {
        await zk.sendMessage(dest, { 
            image: { url: MENU_IMAGE }, 
            caption: message 
        }, { quoted: ms });
    } catch (error) {
        console.log("Sila command error:", error);
        // Fallback - send without image if image fails
        await repondre(message);
    }
});
