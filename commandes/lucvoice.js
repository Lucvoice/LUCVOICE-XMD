const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "lucvoice",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { ms, prefixe, nomAuteurMessage } = commandeOptions;

  const BOT_NAME = "LUCVOICE-XMD";
  const mode = "public";
  const FOOTER_TEXT = "🚀 LucVoice System Active";

  let msg = `
╭━━━〔 🌏 ${BOT_NAME} 〕━━━╮
┃ 👤 USER     : ${nomAuteurMessage}
┃ 🤖 STATUS   : ONLINE ✅
┃ 🌐 MODE     : ${mode.toUpperCase()} 🟢
┃ 💫 PREFIX   : [ ${prefixe} ]
┃ ⚡ SPEED    : FAST ⚡
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🚀 BOT INFO 〕━━━╮
┃ 🔥 NAME     : ${BOT_NAME}
┃ 🧠 ENGINE   : NODE.JS
┃ 🌍 GITHUB   : https://github.com/lucvoice/LUCVOICE-XMD
╰━━━━━━━━━━━━━━━━━━━━━━╯

${FOOTER_TEXT}
`;

  await zk.sendMessage(dest, {
    image: { url: "https://files.catbox.moe/8a9abd.png" },
    caption: msg
  }, { quoted: ms });
});
