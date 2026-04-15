const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");

function formatUptime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    return `${h}h ${m}m ${s}s`;
}

zokou({ nomCom: "upt", categorie: "System" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let uptime = process.uptime();

        let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        let text = `
╭━━〔 ⏱️ LUCVOICE-XMD UPTIME 〕━━╮
┃ 🤖 Bot Status : ONLINE
┃ ⏳ Uptime     : ${formatUptime(uptime)}
┃ 💾 RAM Used   : ${ram} MB
┃ 🖥️ Total RAM  : ${totalRam} GB
┃ ⚡ Engine     : Node.js ${process.version}
╰━━━━━━━━━━━━━━━━━━━━━━╯

🚀 LUCVOICE-XMD is running smoothly!
`;

        await zk.sendMessage(dest, {
            text: text
        }, { quoted: ms });

    } catch (e) {
        console.log("Uptime error:", e);
        repondre("❌ Error kupata uptime");
    }
});
