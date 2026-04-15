const { zokou } = require("../framework/zokou");
const s = require("../set");
const fs = require('fs');
const Heroku = require('heroku-client');

const BOT_NAME = "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
const FOOTER_TEXT = "𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐋𝐮𝐤𝐚 𝐈𝐓";

// Function to get a description of an environment variable
function getDescriptionFromEnv(varName) {
  const filePath = "./app.json";
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const config = JSON.parse(fileContent);
  return config.env[varName]?.description || "The environment variable description was not found.";
}

// Anti-call function setup
zokou({
  nomCom: 'anticall',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *ANTICALL*    │
├─────────────────┤
│  Usage: anticall yes
│  Usage: anticall no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ANTICALL = 'yes';
      responseMessage = `✅ Anti-call has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ANTICALL = 'no';
      responseMessage = `❌ Anti-call has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'anticall yes' or 'anticall no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'areact',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *AREACT*      │
├─────────────────┤
│  Usage: areact yes
│  Usage: areact no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_REACT = 'yes';
      responseMessage = `✅ Auto-react has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_REACT = 'no';
      responseMessage = `❌ Auto-react has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'areact yes' or 'areact no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'readstatus',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *READ STATUS* │
├─────────────────┤
│  Usage: readstatus yes
│  Usage: readstatus no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_READ_STATUS = 'yes';
      responseMessage = `✅ Auto-read status has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_READ_STATUS = 'no';
      responseMessage = `❌ Auto-read status has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'readstatus yes' or 'readstatus no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'antideletedm',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *ANTI-DELETE* │
├─────────────────┤
│  Usage: antideletedm yes
│  Usage: antideletedm no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ANTIDELETEDM = 'yes';
      responseMessage = `✅ Anti-delete has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ANTIDELETEDM = 'no';
      responseMessage = `❌ Anti-delete has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'antideletedm yes' or 'antideletedm no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'downloadstatus',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *DOWNLOAD ST* │
├─────────────────┤
│  Usage: downloadstatus yes
│  Usage: downloadstatus no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_DOWNLOAD_STATUS = 'yes';
      responseMessage = `✅ Auto-download status has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_DOWNLOAD_STATUS = 'no';
      responseMessage = `❌ Auto-download status has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'downloadstatus yes' or 'downloadstatus no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'startmessage',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *START MSG*   │
├─────────────────┤
│  Usage: startmessage yes
│  Usage: startmessage no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.DP = 'yes';
      responseMessage = `✅ Start message has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.DP = 'no';
      responseMessage = `❌ Start message has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'startmessage yes' or 'startmessage no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'readmessage',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *READ MSG*    │
├─────────────────┤
│  Usage: readmessage yes
│  Usage: readmessage no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_READ_MESSAGES = 'yes';
      responseMessage = `✅ Auto-read messages has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_READ_MESSAGES = 'no';
      responseMessage = `❌ Auto-read messages has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'readmessage yes' or 'readmessage no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'pm-permit',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *PM PERMIT*   │
├─────────────────┤
│  Usage: pm-permit yes
│  Usage: pm-permit no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.PM_PERMIT = 'yes';
      responseMessage = `✅ PM permit has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.PM_PERMIT = 'no';
      responseMessage = `❌ PM permit has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'pm-permit yes' or 'pm-permit no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'chatbot',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *CHATBOT*     │
├─────────────────┤
│  Usage: chatbot yes
│  Usage: chatbot no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.CHAT_BOT = 'yes';
      responseMessage = `✅ Chatbot has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.CHAT_BOT = 'no';
      responseMessage = `❌ Chatbot has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'chatbot yes' or 'chatbot no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'areply',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *AREPLY*      │
├─────────────────┤
│  Usage: areply yes
│  Usage: areply no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_REPLY = 'yes';
      responseMessage = `✅ Auto-reply has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_REPLY = 'no';
      responseMessage = `❌ Auto-reply has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'areply yes' or 'areply no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'antivv',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *ANTIVV*      │
├─────────────────┤
│  Usage: antivv yes
│  Usage: antivv no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ANTI_VV = 'yes';
      responseMessage = `✅ Anti-view-once has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ANTI_VV = 'no';
      responseMessage = `❌ Anti-view-once has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'antivv yes' or 'antivv no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'publicmode',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *PUBLIC MODE* │
├─────────────────┤
│  Usage: publicmode yes
│  Usage: publicmode no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.MODE = 'yes';
      responseMessage = `✅ Public mode has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.MODE = 'no';
      responseMessage = `❌ Public mode has been disabled (Private mode enabled).\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'publicmode yes' or 'publicmode no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'autorecord',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *AUTO RECORD* │
├─────────────────┤
│  Usage: autorecord yes
│  Usage: autorecord no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ETAT = '3';
      responseMessage = `✅ Auto-record presence has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ETAT = '0';
      responseMessage = `❌ Auto-record presence has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'autorecord yes' or 'autorecord no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'autotyping',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *AUTO TYPING* │
├─────────────────┤
│  Usage: autotyping yes
│  Usage: autotyping no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ETAT = '2';
      responseMessage = `✅ Auto-typing presence has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ETAT = '0';
      responseMessage = `❌ Auto-typing presence has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'autotyping yes' or 'autotyping no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'alwaysonline',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *ALWAYS ON*   │
├─────────────────┤
│  Usage: alwaysonline yes
│  Usage: alwaysonline no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.ETAT = '1';
      responseMessage = `✅ Always online has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.ETAT = '0';
      responseMessage = `❌ Always online has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'alwaysonline yes' or 'alwaysonline no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'privatemode',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *PRIVATE MODE*│
├─────────────────┤
│  Usage: privatemode yes
│  Usage: privatemode no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.MODE = 'no';
      responseMessage = `✅ Private mode has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.MODE = 'yes';
      responseMessage = `❌ Private mode has been disabled (Public mode enabled).\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'privatemode yes' or 'privatemode no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

zokou({
  nomCom: 'autolikestatus',
  categorie: "SETTINGS"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre(`⚠️ *This command is restricted to the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  if (!arg[0]) {
    return repondre(`╭─────────────────╮
│  📌 *AUTO LIKE*   │
├─────────────────┤
│  Usage: autolikestatus yes
│  Usage: autolikestatus no
├─────────────────┤
│  ✨ ${BOT_NAME} ✨  │
╰─────────────────╯

${FOOTER_TEXT}`);
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;
  switch (option) {
    case "yes":
      s.AUTO_REACT_STATUS = 'yes';
      responseMessage = `✅ Auto-like status has been enabled.\n\n${FOOTER_TEXT}`;
      break;
    case "no":
      s.AUTO_REACT_STATUS = 'no';
      responseMessage = `❌ Auto-like status has been disabled.\n\n${FOOTER_TEXT}`;
      break;
    default:
      return repondre(`⚠️ Invalid option! Use 'autolikestatus yes' or 'autolikestatus no'.\n\n${FOOTER_TEXT}`);
  }

  try {
    await zk.sendMessage(chatId, { text: responseMessage }, { quoted: ms });
  } catch (error) {
    console.error("Error processing your request:", error);
    await zk.sendMessage(chatId, { text: `❌ Error processing your request.\n\n${FOOTER_TEXT}` }, { quoted: ms });
  }
});

// Settings menu with new design
zokou({
  nomCom: 'settings',
  categorie: "SETTINGS"
}, async (chatId, messagingService, context) => {
  const { ms, repondre, superUser, auteurMessage } = context;
  
  if (!superUser) {
    return repondre(`⚠️ *This command is for the bot owner only!*\n\n${FOOTER_TEXT}`);
  }

  const settingsOptions = [
    { nom: "ANTIDELETEDM", choix: ['yes', "no"] },
    { nom: "ADMGROUP", choix: ['yes', "no"] },
    { nom: "ANTILINK", choix: ['yes', "no"] },
    { nom: "ANTIVV", choix: ['yes', "no"] },
    { nom: "ANTICALL", choix: ['yes', 'no'] },
    { nom: "AUTO_REACT_STATUS", choix: ['yes', "no"] },
    { nom: "AUTO_REACT", choix: ['yes', "no"] },
    { nom: "AUTO_VIEW_STATUS", choix: ['yes', "no"] },
    { nom: 'AUTO_SAVE_STATUS', choix: ['yes', "no"] },
    { nom: "PM_PERMIT", choix: ['yes', "no"] },
    { nom: 'MODE', choix: ["public", "private"] },
    { nom: "STARTING_MESSAGE", choix: ['on', "off"] },
    { nom: "AUTO_READ_MESSAGES", choix: ['on', "off"] },
    { nom: 'PRESENCE', choix: ["online", "typing", 'recording'] },
    { nom: "CHAT_BOT", choix: ['on', 'off'] }
  ];

  let settingsMenu = `╭─────────────────╮
│  ⚙️ *SETTINGS*    │
├─────────────────┤
│  ${BOT_NAME}  │
╰─────────────────╯

`;
  settingsOptions.forEach((option, index) => {
    settingsMenu += `  ${index + 1}. *${option.nom}*\n`;
  });
  settingsMenu += `\n📌 *Choose a variable by its number*\n\n${FOOTER_TEXT}`;

  const initialMessage = await messagingService.sendMessage(chatId, { text: settingsMenu }, { quoted: ms });

  const userChoice = await messagingService.awaitForMessage({
    chatJid: chatId,
    sender: auteurMessage,
    timeout: 60000,
    filter: msg => msg.message.extendedTextMessage?.contextInfo.stanzaId === initialMessage.key.id &&
                    msg.message.extendedTextMessage.text > 0 &&
                    msg.message.extendedTextMessage.text <= settingsOptions.length
  });

  const selectedOption = settingsOptions[userChoice.message.extendedTextMessage.text - 1];
  let settingsDetail = `╭─────────────────╮
│  ⚙️ *${selectedOption.nom}*  │
├─────────────────┤
│  📝 Description:  │
│  ${getDescriptionFromEnv(selectedOption.nom).substring(0, 50)}...
├─────────────────┤
│  ✨ Options:      │
╰─────────────────╯

`;
  selectedOption.choix.forEach((choice, index) => {
    settingsDetail += `  ${index + 1} → ${choice}\n`;
  });
  settingsDetail += `\n📌 *Reply with the number of your choice*\n\n${FOOTER_TEXT}`;

  const choiceMessage = await messagingService.sendMessage(chatId, { text: settingsDetail }, { quoted: userChoice });
  
  const userOptionChoice = await messagingService.awaitForMessage({
    chatJid: chatId,
    sender: auteurMessage,
    timeout: 60000,
    filter: msg => msg.message.extendedTextMessage?.contextInfo.stanzaId === choiceMessage.key.id &&
                    msg.message.extendedTextMessage.text > 0 &&
                    msg.message.extendedTextMessage.text <= selectedOption.choix.length
  });

  const heroku = new Heroku({ token: s.HEROKU_API_KEY });
  await heroku.patch(`/apps/${s.HEROKU_APP_NAME}/config-vars`, {
    body: {
      [selectedOption.nom]: selectedOption.choix[userOptionChoice.message.extendedTextMessage.text - 1]
    }
  });

  repondre(`✅ *Settings updated!*\n\nBot is restarting...\n\n${FOOTER_TEXT}`);
});

// Function to change Heroku environment variables
function changevars(commandName, varName) {
  zokou({
    nomCom: commandName,
    categorie: 'SETTINGS'
  }, async (chatId, messagingService, context) => {
    const { arg, superUser, repondre } = context;
    
    if (!superUser) {
      return repondre(`⚠️ *This command is for the bot owner only!*\n\n${FOOTER_TEXT}`);
    }

    if (!s.HEROKU_APP_NAME || !s.HEROKU_API_KEY) {
      return repondre(`❌ Please set HEROKU_APP_NAME and HEROKU_API_KEY variables.\n\n${FOOTER_TEXT}`);
    }

    if (!arg[0]) {
      return repondre(`📌 *${commandName}*\n\n${getDescriptionFromEnv(varName)}\n\n${FOOTER_TEXT}`);
    }

    const heroku = new Heroku({ token: s.HEROKU_API_KEY });
    await heroku.patch(`/apps/${s.HEROKU_APP_NAME}/config-vars`, {
      body: {
        [varName]: arg.join(" ")
      }
    });

    repondre(`✅ *${commandName} updated!*\n\nBot is restarting...\n\n${FOOTER_TEXT}`);
  });
}

changevars("setprefix", "PREFIXES");
changevars("menulinks", "BOT_MENU_LINKS");