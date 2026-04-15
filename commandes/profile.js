const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");

zokou({ nomCom: "profile", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, auteurMessage } = commandeOptions;

    try {
        moment.tz.setDefault("Africa/Dar_es_Salaam");

        const time = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");

        let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        let userNumber = auteurMessage.split("@")[0];

        let profileText = `
╭━━〔 👤 USER PROFILE 〕━━╮
┃ 📱 Number : ${userNumber}
┃ 📅 Date   : ${date}
┃ ⏰ Time   : ${time}
┃ 💻 RAM    : ${ram} MB
┃ 🖥️ System : ${os.platform()}
┃ 📊 Total RAM : ${totalRam} GB
╰━━━━━━━━━━━━━━━━━━╯

🤖 *LUCVOICE-XMD STATUS*
✔ Online
✔ Stable
✔ Active
`;

        await zk.sendMessage(dest, {
            text: profileText
        }, { quoted: ms });

    } catch (e) {
        console.log("Profile error:", e);
        repondre("❌ Error kupata profile info");
    }
});
