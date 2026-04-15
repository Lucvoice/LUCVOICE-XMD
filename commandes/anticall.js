const { zokou } = require("../framework/zokou");
const s = require("../set");

const OWNER_NAME = "LUKA iT";

// Toggle (true = active, false = off)
let ANTI_CALL = true;

zokou({
    nomCom: "anticall",
    categorie: "System",
    reaction: "📵",
    desc: "Anti call protection system"
}, async (dest, zk, commandeOptions) => {

    const { ms, repondre, superUser } = commandeOptions;

    if (!superUser) {
        return repondre("❌ Only owner can change anticall settings!");
    }

    ANTI_CALL = !ANTI_CALL;

    await repondre(`📵 AntiCall is now *${ANTI_CALL ? "ACTIVE" : "DISABLED"}*`);
});

// 📵 CALL EVENT HANDLER (depends on your framework support)
zk.ev.on("call", async (callData) => {
    try {
        if (!ANTI_CALL) return;

        for (let call of callData) {

            const callerId = call.from;

            // reject call
            await zk.rejectCall(call.id, callerId);

            // optional warning message
            await zk.sendMessage(callerId, {
                text: `
📵 *ANTI-CALL ACTIVE*

❌ Calls are not allowed on this bot
👑 Owner: ${OWNER_NAME}

⚠️ Please text instead of calling
`
            });

        }

    } catch (e) {
        console.log("AntiCall error:", e);
    }
});
