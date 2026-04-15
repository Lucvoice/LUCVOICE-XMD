const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

// ===============================
// 📖 QURAN COMMAND (LUCVOICE-XMD)
// ===============================
zokou({ nomCom: "quran", categorie: "Islam" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        if (!arg || !arg[0]) {
            return repondre(
`📖 *LUCVOICE-XMD QURAN COMMAND*

Tumia:
.quran <surah number>

Mfano:
.quran 1
.quran 36
.quran 112

🌙 May Allah guide us all 🤲`
            );
        }

        let surah = parseInt(arg[0]);

        if (isNaN(surah) || surah < 1 || surah > 114) {
            return repondre("❌ Please enter a valid Surah number (1 - 114).");
        }

        repondre("📖 Fetching Quran Surah... please wait 🤲");

        // Get Surah details (Arabic + English + audio)
        let url = `https://api.alquran.cloud/v1/surah/${surah}/editions/ar.alafasy,en.asad,en.pickthall`;

        let res = await axios.get(url);

        let arabic = res.data.data[0];
        let english = res.data.data[1];

        let surahName = arabic.englishName;
        let totalAyahs = arabic.numberOfAyahs;
        let revelation = arabic.revelationType;

        // First Ayah audio
        let audio = arabic.ayahs[0].audio;

        let text = `
╭━━〔 📖 LUCVOICE-XMD QURAN 〕━━╮
┃ 🌙 Surah : ${surahName}
┃ 🔢 Number: ${surah}
┃ 📊 Ayahs : ${totalAyahs}
┃ 🕌 Type  : ${revelation}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📜 *First Ayah (English)*:
${english.ayahs[0].text}

🤲 *Message*:
May Allah bless and guide us all.
`;

        await zk.sendMessage(dest, {
            audio: { url: audio },
            mimetype: "audio/mp4",
            ptt: true
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            text: text
        }, { quoted: ms });

    } catch (e) {
        console.log("Quran error:", e);
        repondre("❌ Failed to fetch Quran Surah. Try again later.");
    }
});
