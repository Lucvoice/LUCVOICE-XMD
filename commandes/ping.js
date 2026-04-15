const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "ping",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  // Step 1
  let start = new Date().getTime();
  let msg = await zk.sendMessage(dest, { text: "🏓 Pinging..." }, { quoted: ms });

  // Step 2 (speed)
  let speed = new Date().getTime() - start;
  await zk.sendMessage(dest, {
    text: `⚡ Speed: ${speed}ms`
  }, { edit: msg.key });

  // Step 3 (loading)
  await new Promise(r => setTimeout(r, 800));
  await zk.sendMessage(dest, {
    text: "📡 Checking system..."
  }, { edit: msg.key });

  // Step 4 (final UI)
  await new Promise(r => setTimeout(r, 800));
  await zk.sendMessage(dest, {
    text: `
╭───〔 🤖 LUCVOICE-XMD 〕───
│ 🏓 Pong!
│ ⚡ Speed  : ${speed} ms
│ 📡 Status : ONLINE 🟢
╰───────────────
`
  }, { edit: msg.key });

});
