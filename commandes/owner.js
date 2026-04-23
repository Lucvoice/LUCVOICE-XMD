const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "owner",
  categorie: "General",
  reaction: "👑"
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  const caption = `
╭━━━〔 👑 LUCVOICE-XMD OWNER 〕━━━╮
┃ 🤖 Bot Name : LUCVOICE-XMD
┃ 👑 Owner    : Lucvoice
┃ 📞 Number   : +255768619068
┃ 🌍 Country  : Tanzania
┃ ⚡ Status   : Online
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

  await zk.sendMessage(dest, {
    image: { url: "https://files.catbox.moe/vhre8c.png" },
    caption: caption
  }, { quoted: ms });

});
