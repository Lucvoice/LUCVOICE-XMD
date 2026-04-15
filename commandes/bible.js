const { zokou } = require("../framework/zokou");
const axios = require("axios");
const s = require("../set");

zokou({
    nomCom: "bible",
    categorie: "Religion",
    reaction: "📖",
    desc: "Bible menu and verse reader"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    // 📌 IF NO ARGUMENT → SHOW MENU
    if (!arg || arg.length === 0) {

        let infoMsg = `

🤲🕍 ┈─• *HOLY BIBLE MENU* •─┈ 🕍🤲

💫 Type command to read verses:
👉 ${s.PREFIXE}bible john 3:16
👉 ${s.PREFIXE}bible psalm 23:1

━━━━━━━━━━━━━━━━━━

📜 *OLD TESTAMENT*
Genesis, Exodus, Leviticus, Numbers, Deuteronomy...
Joshua, Judges, Ruth, Samuel, Kings...

━━━━━━━━━━━━━━━━━━

📖 *NEW TESTAMENT*
Matthew, Mark, Luke, John, Acts...
Romans, Corinthians, Galatians...

━━━━━━━━━━━━━━━━━━

🙏 *God’s word brings peace, hope and strength*
`;

        return repondre(infoMsg);
    }

    // 📌 GET VERSE
    const query = arg.join(" ");

    try {

        const res = await axios.get(`https://bible-api.com/${encodeURIComponent(query)}`);

        if (!res.data || !res.data.text) {
            return repondre("❌ Verse not found! Try format: John 3:16");
        }

        let infoMsg = `
╭━━〔 📖 HOLY BIBLE VERSE 〕━━╮
┃ 🔹 Reference: ${res.data.reference}
╰━━━━━━━━━━━━━━━━━━╯

💬 *Verse:*
"${res.data.text.trim()}"

╭━━〔 🙏 MESSAGE 〕━━╮
┃ God’s word brings peace ✨
┃ Stay blessed 🙏
╰━━━━━━━━━━━━━━━━━━╯
`;

        await repondre(infoMsg);

    } catch (e) {
        console.log("Bible error:", e);
        repondre("❌ Error fetching Bible verse");
    }
});
