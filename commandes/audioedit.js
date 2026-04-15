const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const os = require("os");

zokou({
    nomCom: "audioedit",
    categorie: "Tools",
    reaction: "🎧",
    desc: "Edit audio (bass, slow, fast)"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`
🎧 *AUDIO EDIT COMMAND*

Usage:
.audioedit bass (reply audio)
.audioedit slow (reply audio)
.audioedit fast (reply audio)
`);
    }

    const mode = arg[0].toLowerCase();

    const input = path.join(os.tmpdir(), "input.mp3");
    const output = path.join(os.tmpdir(), "output.mp3");

    try {

        // download replied audio
        let msg = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!msg || !msg.audioMessage) {
            return repondre("❌ Please reply to an audio file!");
        }

        let stream = await zk.downloadAndSaveMediaMessage(msg.audioMessage, input);

        let filter;

        // 🎧 effects
        if (mode === "bass") {
            filter = "bass=g=10";
        } 
        else if (mode === "slow") {
            filter = "atempo=0.7";
        } 
        else if (mode === "fast") {
            filter = "atempo=1.5";
        } 
        else {
            return repondre("❌ Invalid mode! Use bass, slow, or fast");
        }

        await repondre("🎧 Processing audio... please wait");

        ffmpeg(stream)
            .audioFilter(filter)
            .save(output)
            .on("end", async () => {

                await zk.sendMessage(dest, {
                    audio: fs.readFileSync(output),
                    mimetype: "audio/mp4"
                }, { quoted: ms });

                fs.unlinkSync(input);
                fs.unlinkSync(output);
            })
            .on("error", (err) => {
                console.log("Audio edit error:", err);
                repondre("❌ Failed to process audio");
            });

    } catch (e) {
        console.log("Audioedit error:", e);
        repondre("❌ Error editing audio");
    }
});
