const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");

zokou({ nomCom: "mute", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isBotAdmin) return repondre("❌ Bot si admin kwenye group hii.");
        if (!isAdmin) return repondre("❌ Command hii ni ya admins tu.");

        await zk.groupSettingUpdate(dest, "announcement"); // only admins can send messages

        return repondre("🔇 Group imefungwa! Sasa ni admins pekee wanaoweza kutuma messages.");

    } catch (e) {
        console.log(e);
        repondre("❌ Error kwenye mute command");
    }
});

zokou({ nomCom: "unmute", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, isAdmin, isBotAdmin } = commandeOptions;

    try {
        if (!isBotAdmin) return repondre("❌ Bot si admin kwenye group hii.");
        if (!isAdmin) return repondre("❌ Command hii ni ya admins tu.");

        await zk.groupSettingUpdate(dest, "not_announcement"); // everyone can send messages

        return repondre("🔊 Group imefunguliwa! Sasa members wote wanaweza kutuma messages.");

    } catch (e) {
        console.log(e);
        repondre("❌ Error kwenye unmute command");
    }
});
