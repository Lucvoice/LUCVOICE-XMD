const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const os = require("os");

zokou({
    nomCom: "videostyle",
    categorie: "Tools",
    reaction: "🎬",
    desc: "Apply effects to video"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`
🎬 *VIDEO STYLE COMMAND*

Usage:
.videostyle slow (reply video)
.videostyle fast (reply video)
.videostyle bw (black & white)
.videostyle reverse (experimental)
`);
    }

    const mode = arg[0].toLowerCase();

    const input = path.join(os.tmpdir(), "input.mp4");
    const output = path.join(os.tmpdir(), "output.mp4");

    try {

        let msg = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!msg || !msg.videoMessage) {
            return repondre("❌ Please reply to a video!");
        }

        await zk.downloadAndSaveMediaMessage(msg.videoMessage, input);

        let filter;

        // 🎬 effects
        if (mode === "slow") {
            filter = "setpts=2.0*PTS";
        } 
        else if (mode === "fast") {
            filter = "setpts=0.5*PTS";
        } 
        else if (mode === "bw") {
            filter = "hue=s=0";
        } 
        else if (mode === "reverse") {
            filter = "reverse";
        } 
        else {
            return repondre("❌ Invalid mode! Use slow, fast, bw, reverse");
        }

        await repondre("🎬 Processing video... please wait");

        ffmpeg(input)
            .videoFilter(filter)
            .save(output)
            .on("end", async () => {

                await zk.sendMessage(dest, {
                    video: fs.readFileSync(output),
                    mimetype: "video/mp4",
                    caption: "🎬 *Video edited successfully*"
                }, { quoted: ms });

                fs.unlinkSync(input);
                fs.unlinkSync(output);
            })
            .on("error", (err) => {
                console.log("Video style error:", err);
                repondre("❌ Failed to process video");
            });

    } catch (e) {
        console.log("Videostyle error:", e);
        repondre("❌ Error editing video");
    }
});
