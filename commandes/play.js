const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const ytdl = require("ytdl-core");

zokou({
    nomCom: "play",
    categorie: "Download",
    reaction: "🎵",
    desc: "Download YouTube audio"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("❌ Please provide a song name!\nExample: .play baby calm down");
    }

    const query = arg.join(" ");

    try {
        // search youtube
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return repondre("❌ No results found!");
        }

        const url = video.url;

        let info = `
╭━━〔 🎵 PLAY SONG 〕━━╮
┃ 🎧 Title : ${video.title}
┃ 👤 Author: ${video.author.name}
┃ ⏱ Duration: ${video.timestamp}
┃ 👀 Views : ${video.views}
╰━━━━━━━━━━━━━━━━━━╯

⬇️ Downloading audio...
`;

        await repondre(info);

        // download audio
        const stream = ytdl(url, { filter: "audioonly" });

        await zk.sendMessage(dest, {
            audio: stream,
            mimetype: "audio/mp4",
            fileName: `${video.title}.mp3`
        }, { quoted: ms });

    } catch (error) {
        console.log("Play error:", error);
        repondre("❌ Error downloading song. Try again later.");
    }
});
