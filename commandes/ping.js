const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "ping",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  // Step 1
  let start = new Date().getTime();

  let msg = await zk.sendMessage(dest, {
    text: "🏓 Pinging..."
  }, { quoted: ms });

  // Step 2
  let speed = new Date().getTime() - start;

  await zk.sendMessage(dest, {
    text: `⚡ Speed: ${speed}ms`
  }, { edit: msg.key });

  // Step 3
  await new Promise(r => setTimeout(r, 1000));

  await zk.sendMessage(dest, {
    image: { url: "https://files.catbox.moe/vhre8c.png" },
    caption: "📸 Loading Ping Result..."
  }, { quoted: ms });

  // Step 4 Final
  await new Promise(r => setTimeout(r, 1000));

  await zk.sendMessage(dest, {
    text: `
╭━━━〔 🤖 LUCVOICE-XMD 〕━━━╮
┃ 🏓 Pong Successful
┃ ⚡ Speed: ${speed}ms
┃ 💻 Mode: Online
╰━━━━━━━━━━━━━━━━━━╯
`
  }, { edit: msg.key });

});
