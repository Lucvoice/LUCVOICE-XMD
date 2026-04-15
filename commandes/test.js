const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "test", categorie: "System" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre } = commandeOptions;

    try {
        let start = Date.now();

        await repondre("🧪 Testing LUCVOICE-XMD system...");

        let end = Date.now();
        let speed = end - start;

        await zk.sendMessage(dest, {
            text: `
╭━━〔 🧪 LUCVOICE-XMD TEST 〕━━╮
┃ 🤖 Status : ONLINE
┃ ⚡ Speed  : ${speed} ms
┃ 📡 Response : OK
┃ 💾 Memory : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
╰━━━━━━━━━━━━━━━━━━━━━━╯

🚀 Bot is working perfectly!
`
        }, { quoted: ms });

    } catch (e) {
        console.log("Test error:", e);
        repondre("❌ Test failed");
    }
});
