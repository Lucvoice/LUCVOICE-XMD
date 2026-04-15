const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "create", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, auteurMessage } = commandeOptions;

    try {
        if (!arg || arg.length < 2) {
            return repondre("❌ Tumia: .create GroupName");
        }

        let groupName = arg.join(" ");

        // NOTE: WhatsApp bot must support groupCreate
        const group = await zk.groupCreate(groupName, [auteurMessage]);

        let inviteCode = await zk.groupInviteCode(group.id);
        let inviteLink = "https://chat.whatsapp.com/" + inviteCode;

        repondre(
            `╭━━〔 🤖 GROUP CREATED 〕━━╮\n` +
            `┃ 📛 Name : ${groupName}\n` +
            `┃ 🔗 Link : ${inviteLink}\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (e) {
        console.log("Create error:", e);
        repondre("❌ Imeshindikana ku-create group. Bot yako huenda hai-support groupCreate.");
    }
});
