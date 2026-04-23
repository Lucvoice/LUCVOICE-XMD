const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

zokou({
  nomCom: "update",
  categorie: "Owner",
  reaction: "♻️"
}, async (dest, zk, commandeOptions) => {

  const { ms, repondre, superUser } = commandeOptions;

  if (!superUser) return repondre("🚫 Owner Only Command!");

  let msg = await zk.sendMessage(dest, {
    text: "🔄 Checking for updates..."
  }, { quoted: ms });

  exec("git pull", async (err, stdout, stderr) => {

    if (err) {
      return await zk.sendMessage(dest, {
        text: `❌ Update Failed!\n\n${err.message}`
      }, { edit: msg.key });
    }

    if (stdout.includes("Already up to date")) {
      return await zk.sendMessage(dest, {
        text: `
╭━━━〔 ✅ LUCVOICE-XMD 〕━━━╮
┃ Bot is already updated
╰━━━━━━━━━━━━━━━━━━━━╯
`
      }, { edit: msg.key });
    }

    await zk.sendMessage(dest, {
      text: `
╭━━━〔 🚀 LUCVOICE-XMD 〕━━━╮
┃ Update Installed Successfully
┃ Restarting Bot...
╰━━━━━━━━━━━━━━━━━━━━╯
`
    }, { edit: msg.key });

    process.exit(0);
  });

});
