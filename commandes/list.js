const { zokou } = require(__dirname + "/../framework/zokou");
const { cm } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "list", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, prefixe } = commandeOptions;

    try {
        let coms = {};

        // group commands by category
        cm.forEach((com) => {
            if (!coms[com.categorie]) coms[com.categorie] = [];
            coms[com.categorie].push(com.nomCom);
        });

        // if user requested specific category
        let filter = arg && arg[0] ? arg[0].toLowerCase() : null;

        let text = `╭━━〔 📜 COMMAND LIST 〕━━╮\n`;

        for (let cat in coms) {
            if (filter && cat.toLowerCase() !== filter) continue;

            text += `\n╭──〔 ${cat.toUpperCase()} 〕──╮\n│`;

            coms[cat].forEach(cmd => {
                text += `\n│ ➤ ${prefixe}${cmd}`;
            });

            text += `\n╰──────────────╯\n`;
        }

        text += `
╭━━〔 INFO 〕━━╮
┃ Total Categories: ${Object.keys(coms).length}
┃ Use: .list <category>
╰━━━━━━━━━━━━╯`;

        return repondre(text);

    } catch (e) {
        console.log(e);
        repondre("❌ Error kwenye list command");
    }
});
