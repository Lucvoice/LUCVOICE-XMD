process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION:', reason);
});

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'info';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} =require("./bdd/onlyAdmin");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("./bdd/warn");
const { 
  verifierStatusEtatJid, 
  recupererStatusActionJid 
} = require("./bdd/antistatus");
let { reagir } = require(__dirname + "/framework/app");

// ============ SILA CONFIG ============
const sila = require("./sila/sila");
const { applyFontToMessage } = require("./sila/fonts/fontHandler");

// ============ ANTI MODULES ============
const { handleAntiBug } = require('./sila/antibug');
const { handleAntiSpam } = require('./sila/antispam');
const { handleAntiTag } = require('./sila/antitag');
const { handleAntiFake } = require('./sila/antifake');
const { handleAntiBadWords } = require('./sila/antibadwords');
const { handleAntiForward } = require('./sila/antiforward');
const { handleAntiGroupLink } = require('./sila/antigrouplink');
const { handleAntiVirtex } = require('./sila/antivirtex');
const { handleAntiTagAll } = require('./sila/antitagall');
const { handleAntiEdit } = require('./sila/antiedit');
const { handleChatbotMessage } = require('./sila/chatbot');

var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

// Simple colors for console
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgBlue: '\x1b[44m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgRed: '\x1b[41m'
};

function logMsg(type, text) {
    const time = new Date().toLocaleTimeString();
    if (type === 'info') console.log(c.blue + `[${time}] ℹ️ ` + c.white + text + c.reset);
    else if (type === 'success') console.log(c.green + `[${time}] ✅ ` + c.white + text + c.reset);
    else if (type === 'error') console.log(c.red + `[${time}] ❌ ` + c.white + text + c.reset);
    else if (type === 'warn') console.log(c.yellow + `[${time}] ⚠️ ` + c.white + text + c.reset);
    else console.log(c.cyan + `[${time}] ` + c.white + text + c.reset);
}

// Global variables
global.lastReactionTime = 0;
global.deletedMessages = {};
global.antitag = global.antitag || {};

// ==================== GROUP SETTINGS MANAGER ====================
const groupSettingsPath = './silatz/group-settings.json';

function loadGroupSettings() {
    if (!fs.existsSync(groupSettingsPath)) return {};
    try { return JSON.parse(fs.readFileSync(groupSettingsPath)); } catch (e) { return {}; }
}

function saveGroupSettings(settings) {
    const dir = path.dirname(groupSettingsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(groupSettingsPath, JSON.stringify(settings, null, 2));
}

function getGroupSetting(groupId, feature) {
    const settings = loadGroupSettings();
    if (!settings[groupId]) return null;
    return settings[groupId][feature];
}

function setGroupSetting(groupId, feature, value) {
    const settings = loadGroupSettings();
    if (!settings[groupId]) settings[groupId] = {};
    settings[groupId][feature] = value;
    saveGroupSettings(settings);
    return true;
}

// ==================== DEFAULT ANTIMEDIA TYPES ====================
const defaultAntiMediaTypes = {
    image: true, video: true, audio: true, voice: true, document: true,
    sticker: true, text: false, gif: true, poll: true, location: true,
    contact: true, viewonce: true
};

// ==================== DETECT MEDIA TYPE ====================
const detectMediaType = (message) => {
    if (!message) return 'unknown';
    const type = Object.keys(message)[0];
    
    if (type === 'viewOnceMessage' || type === 'viewOnceMessageV2' || type === 'viewOnceMessageV2Extension') {
        const innerMsg = message[type]?.message;
        if (innerMsg) {
            const innerType = Object.keys(innerMsg)[0];
            if (innerType === 'imageMessage') return 'viewonce';
            if (innerType === 'videoMessage') return 'viewonce';
        }
        return 'viewonce';
    }
    
    if (type === 'ephemeralMessage') {
        const innerMsg = message.ephemeralMessage?.message;
        if (innerMsg) return detectMediaType(innerMsg);
    }
    
    const mediaMap = {
        'conversation': 'text', 'extendedTextMessage': 'text', 'imageMessage': 'image',
        'videoMessage': 'video', 'audioMessage': 'audio', 'documentMessage': 'document',
        'stickerMessage': 'sticker', 'contactMessage': 'contact', 'contactsArrayMessage': 'contact',
        'locationMessage': 'location', 'liveLocationMessage': 'location',
        'pollCreationMessage': 'poll', 'pollUpdateMessage': 'poll'
    };
    
    if (type === 'audioMessage' && message.audioMessage?.ptt) return 'voice';
    if (type === 'videoMessage' && message.videoMessage?.gifPlayback) return 'gif';
    
    return mediaMap[type] || 'unknown';
};

// ==================== SHOULD DELETE MEDIA ====================
const shouldDeleteMedia = (message, antimediaConfig) => {
    if (!antimediaConfig || !antimediaConfig.enabled) return { shouldDelete: false, type: 'unknown' };
    if (!antimediaConfig.types) antimediaConfig.types = { ...defaultAntiMediaTypes };
    const mediaType = detectMediaType(message);
    return { shouldDelete: antimediaConfig.types[mediaType] === true, type: mediaType };
};

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            logMsg('info', '🔐 Connecting to WhatsApp...');
            const { Buffer } = require("buffer");
            await fs.writeFileSync(__dirname + "/auth/creds.json", Buffer.from(session, 'base64').toString('utf-8'), "utf8");
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            const { Buffer } = require("buffer");
            await fs.writeFileSync(__dirname + "/auth/creds.json", Buffer.from(session, 'base64').toString('utf-8'), "utf8");
        }
    } catch (e) {
        logMsg('error', 'Session Invalid: ' + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['𝚂𝙸𝙻𝙰 𝙼𝙳', "safari", "2.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30000,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return { conversation: 'An Error Occurred, Repeat Command!' };
            }
        };
        
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        
        // Bot identity
        const botIdentity = {
            botName: sila.getConfig().botName,
            creatorName: sila.getConfig().ownerName,
            creatorNumber: sila.getConfig().ownerNumber
        };
        
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;
            
            const decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else return jid;
            };
            
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : 
                       mtype == "imageMessage" ? ms.message.imageMessage?.caption : 
                       mtype == "videoMessage" ? ms.message.videoMessage?.caption : 
                       mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : 
                       mtype == "buttonsResponseMessage" ? ms?.message?.buttonsResponseMessage?.selectedButtonId : 
                       mtype == "listResponseMessage" ? ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : 
                       mtype == "messageContextInfo" ? (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) auteurMessage = idBot;
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255622286792';
            const dj2 = '255622286792';
            const dj3 = "255622286792";
            const luffy = '255622286792';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            const senderNumber = auteurMessage.split('@')[0];
            const isProtected = superUser;
            
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            
            function repondre(mes) { 
                mes = applyFontToMessage(mes);
                zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); 
            }
            
            // PRO CONSOLE MESSAGE
            console.log('');
            console.log(c.bgBlue + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
            console.log(c.cyan + '  💬 MESSAGE RECEIVED ' + c.reset);
            console.log(c.bgBlue + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
            if (verifGroupe) console.log(c.yellow + '  ├─ 📁 Group     : ' + c.green + nomGroupe + c.reset);
            console.log(c.yellow + '  ├─ 👤 From      : ' + c.magenta + (nomAuteurMessage || senderNumber) + c.reset);
            console.log(c.yellow + '  ├─ 🆔 ID        : ' + c.cyan + senderNumber + c.reset);
            console.log(c.yellow + '  ├─ 📝 Type      : ' + c.blue + mtype + c.reset);
            console.log(c.yellow + '  └─ 💬 Content   : ' + c.white + (texte || "📎 Media message") + c.reset);
            console.log(c.bgBlue + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
            console.log('');
            
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (let m of membreGroupe) {
                    if (m.admin == null) continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat = conf.ETAT;
            if(etat==1) await zk.sendPresenceUpdate("available",origineMessage);
            else if(etat==2) await zk.sendPresenceUpdate("composing",origineMessage);
            else if(etat==3) await zk.sendPresenceUpdate("recording",origineMessage);
            else await zk.sendPresenceUpdate("unavailable",origineMessage);

            const mbre = verifGroupe ? infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : [];
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;
            
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const lien = conf.URL.split(',');
            
            function mybotpic() {
                const indiceAleatoire = Math.floor(Math.random() * lien.length);
                return lien[indiceAleatoire];
            }
            
            var commandeOptions = {
                superUser, dev, verifGroupe, mbre, membreGroupe, verifAdmin, infosGroupe,
                nomGroupe, auteurMessage, nomAuteurMessage, idBot, verifZokouAdmin, prefixe,
                arg, repondre, mtype, groupeAdmin, msgRepondu, auteurMsgRepondu, ms, mybotpic,
                sila, getGroupSetting, setGroupSetting
            };

            // ==================== STORE MESSAGES FOR ANTI-DELETE ====================
            try {
                const chatId = ms.key.remoteJid;
                if (!global.deletedMessages[chatId]) global.deletedMessages[chatId] = [];
                global.deletedMessages[chatId].push({
                    key: ms.key, message: ms.message,
                    messageTimestamp: ms.messageTimestamp || Date.now() / 1000, pushName: ms.pushName
                });
                if (global.deletedMessages[chatId].length > 20) global.deletedMessages[chatId] = global.deletedMessages[chatId].slice(-20);
            } catch (e) { console.log("Store error:", e.message); }

            // ==================== ANTIMEDIA (PER-GROUP) ====================
            if (verifGroupe && !ms.key.fromMe && !isProtected) {
                const groupAntimedia = getGroupSetting(origineMessage, 'antimedia');
                const groupAntimediaTypes = getGroupSetting(origineMessage, 'antimediaTypes');
                
                let antimediaEnabled = false;
                let antimediaTypes = null;
                
                if (groupAntimedia !== null) {
                    antimediaEnabled = groupAntimedia;
                    antimediaTypes = groupAntimediaTypes || defaultAntiMediaTypes;
                } else if (conf.antimedia) {
                    antimediaEnabled = true;
                    antimediaTypes = conf.antimediaTypes || defaultAntiMediaTypes;
                }
                
                if (antimediaEnabled && antimediaTypes) {
                    const { shouldDelete, type } = shouldDeleteMedia(ms.message, { enabled: true, types: antimediaTypes });
                    
                    if (shouldDelete) {
                        logMsg('warn', `🗑️ Antimedia: Deleting ${type} from ${senderNumber} in ${origineMessage}`);
                        try {
                            await zk.sendMessage(origineMessage, { delete: ms.key });
                            if (conf.NUMERO_OWNER) {
                                const ownerJid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
                                await zk.sendMessage(ownerJid, {
                                    text: applyFontToMessage(`🗑️ ANTIMEDIA\n\nGROUP: ${origineMessage}\nSENDER: @${senderNumber}\nTYPE: ${type}\nACTION: DELETED`),
                                    mentions: [auteurMessage]
                                });
                            }
                            return;
                        } catch (e) { console.error('Antimedia delete error:', e); }
                    }
                }
            }

            // ==================== ANTI FEATURES (Skip protected users) ====================
            if (!ms.key.fromMe && !isProtected) {
                if (conf.antibug) await handleAntiBug(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antispam) await handleAntiSpam(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antitag) await handleAntiTag(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antibadwords) await handleAntiBadWords(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antiforward) await handleAntiForward(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antigrouplink) await handleAntiGroupLink(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antivirtex) await handleAntiVirtex(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antitagall) await handleAntiTagAll(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antiedit) await handleAntiEdit(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
                if (conf.antifake && verifGroupe) await handleAntiFake(zk, origineMessage, ms, auteurMessage, senderNumber, conf, sila);
            }

            // ==================== ANTI-TAG ====================
            if (verifGroupe && global.antitag[origineMessage] && global.antitag[origineMessage].enabled === true) {
                try {
                    if (!ms.key.fromMe) {
                        const sender = auteurMessage;
                        const senderClean = decodeJid(sender);
                        const cleanAdmins = admins.map(admin => decodeJid(admin));
                        const isSenderAdmin = cleanAdmins.includes(senderClean);
                        
                        if (!isSenderAdmin) {
                            let hasTag = false;
                            if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) hasTag = true;
                            if (ms.message?.extendedTextMessage?.contextInfo?.quotedMessage) hasTag = true;
                            if (texte && texte.includes('@')) hasTag = true;
                            
                            if (hasTag) {
                                logMsg('warn', `🚫 Anti-tag: Deleting message from ${senderClean}`);
                                await zk.sendMessage(origineMessage, { delete: { remoteJid: origineMessage, fromMe: false, id: ms.key.id, participant: sender } });
                                await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🚫 @${senderClean.split('@')[0]} Don't tag members!`), mentions: [senderClean] });
                            }
                        }
                    }
                } catch (e) { console.error("Anti-tag error:", e); }
            }

            // ==================== ANTI-DELETE MESSAGE ====================
            if (ms.message?.protocolMessage && ms.message.protocolMessage.type === 0) {
                const antiDeleteEnabled = conf.ANTI_DELETE_MESSAGE === "yes" || conf.ADM === "yes";
                if (antiDeleteEnabled && !ms.key.fromMe && !ms.message.protocolMessage.key.fromMe) {
                    logMsg('warn', '🗑️ Deleted message detected!');
                    const deletedKey = ms.message.protocolMessage.key;
                    const chatId = deletedKey.remoteJid;
                    const msgId = deletedKey.id;
                    const deletedMsg = global.deletedMessages[chatId]?.find(m => m.key.id === msgId);
                    
                    if (deletedMsg) {
                        try {
                            const participant = deletedMsg.key.participant || deletedMsg.key.remoteJid;
                            const senderNumberDel = participant.split('@')[0];
                            const ownerJid = conf.NUMERO_OWNER + "@s.whatsapp.net";
                            let chatName = chatId;
                            if (chatId.endsWith('@g.us')) {
                                try { const meta = await zk.groupMetadata(chatId); chatName = meta.subject || chatId; } catch { }
                            }
                            const msgType = Object.keys(deletedMsg.message)[0] || 'unknown';
                            
                            await zk.sendMessage(ownerJid, {
                                text: applyFontToMessage(`╭━━━ *『 ANTI-DELETE 』* ━━━╮\n┃\n┃ 👤 Sender: @${senderNumberDel}\n┃ 💬 Chat: ${chatName}\n┃ 📝 Type: ${msgType.replace('Message','')}\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`),
                                mentions: [participant]
                            });
                            
                            if (deletedMsg.message.conversation) {
                                await zk.sendMessage(ownerJid, { text: applyFontToMessage(`📝 Deleted Text:\n\n${deletedMsg.message.conversation}`) });
                            } else if (deletedMsg.message.extendedTextMessage?.text) {
                                await zk.sendMessage(ownerJid, { text: applyFontToMessage(`📝 Deleted Text:\n\n${deletedMsg.message.extendedTextMessage.text}`) });
                            } else if (deletedMsg.message.imageMessage) {
                                const img = await zk.downloadAndSaveMediaMessage(deletedMsg.message.imageMessage);
                                await zk.sendMessage(ownerJid, { image: { url: img }, caption: applyFontToMessage(`🖼️ Deleted Image`) });
                            } else if (deletedMsg.message.videoMessage) {
                                const vid = await zk.downloadAndSaveMediaMessage(deletedMsg.message.videoMessage);
                                await zk.sendMessage(ownerJid, { video: { url: vid }, caption: applyFontToMessage(`🎥 Deleted Video`) });
                            }
                            logMsg('success', '✅ Deleted message sent to owner.');
                        } catch (err) { console.error("Error sending deleted message:", err); }
                    }
                }
            }

            // ==================== ANTI-LINK ====================
            if (verifGroupe && texte && /(https?:\/\/|www\.)/gi.test(texte)) {
                try {
                    const antiLinkEnabled = await verifierEtatJid(origineMessage);
                    if (antiLinkEnabled && !superUser && !verifAdmin && verifZokouAdmin) {
                        logMsg('warn', `🔗 Anti-link activated from ${senderNumber}`);
                        const action = await recupererActionJid(origineMessage) || 'warn';
                        const key = { remoteJid: origineMessage, fromMe: false, id: ms.key.id, participant: auteurMessage };
                        
                        if (action === 'remove') {
                            await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🔗 Link detected, @${senderNumber} has been removed.`), mentions: [auteurMessage] }, { quoted: ms });
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                            await zk.sendMessage(origineMessage, { delete: key });
                        } else if (action === 'delete') {
                            await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🔗 Link detected, @${senderNumber} message deleted.`), mentions: [auteurMessage] }, { quoted: ms });
                            await zk.sendMessage(origineMessage, { delete: key });
                        } else {
                            const warnCount = await getWarnCountByJID(auteurMessage) || 0;
                            const warnLimit = 3;
                            if (warnCount >= warnLimit) {
                                await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🔗 @${senderNumber} removed for 3 links.`), mentions: [auteurMessage] }, { quoted: ms });
                                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                await resetWarnCountByJID(auteurMessage);
                            } else {
                                await ajouterUtilisateurAvecWarnCount(auteurMessage);
                                const newCount = warnCount + 1;
                                await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🔗 Link detected! @${senderNumber} warning ${newCount}/3`), mentions: [auteurMessage] }, { quoted: ms });
                            }
                            await zk.sendMessage(origineMessage, { delete: key });
                        }
                    }
                } catch (e) { console.log("Anti-link error:", e); }
            }

            // ==================== ANTI-STATUS ====================
            if (verifGroupe && ms.message && !ms.key.fromMe) {
                try {
                    const antiStatusEnabled = await verifierStatusEtatJid(origineMessage);
                    if (antiStatusEnabled) {
                        let isStatusMention = false;
                        const contextInfo = ms.message?.extendedTextMessage?.contextInfo || ms.message?.imageMessage?.contextInfo || ms.message?.videoMessage?.contextInfo;
                        
                        if (contextInfo?.quotedMessage && contextInfo?.participant && contextInfo.participant.includes('status@broadcast')) isStatusMention = true;
                        if (texte && (texte.includes('status@broadcast') || (texte.includes('status') && texte.includes('@')))) isStatusMention = true;
                        
                        if (isStatusMention) {
                            const action = await recupererStatusActionJid(origineMessage) || 'delete';
                            const sender = auteurMessage;
                            const groupMetadata = await zk.groupMetadata(origineMessage);
                            const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
                            const isSenderAdmin = groupAdmins.includes(sender);
                            
                            if (!isSenderAdmin) {
                                const key = { remoteJid: origineMessage, fromMe: false, id: ms.key.id, participant: sender };
                                await zk.sendMessage(origineMessage, { delete: key });
                                
                                if (action === 'remove') {
                                    await zk.sendMessage(origineMessage, { text: applyFontToMessage(`📵 @${sender.split('@')[0]} removed for status mention.`), mentions: [sender] });
                                    await zk.groupParticipantsUpdate(origineMessage, [sender], "remove");
                                } else if (action === 'warn') {
                                    const warnCount = await getWarnCountByJID(sender) || 0;
                                    const warnLimit = conf.WARN_COUNT || 3;
                                    if (warnCount >= warnLimit) {
                                        await zk.sendMessage(origineMessage, { text: applyFontToMessage(`📵 @${sender.split('@')[0]} removed (3 strikes).`), mentions: [sender] });
                                        await zk.groupParticipantsUpdate(origineMessage, [sender], "remove");
                                        await resetWarnCountByJID(sender);
                                    } else {
                                        await ajouterUtilisateurAvecWarnCount(sender);
                                        await zk.sendMessage(origineMessage, { text: applyFontToMessage(`📵 @${sender.split('@')[0]} warning ${warnCount+1}/${warnLimit}`), mentions: [sender] });
                                    }
                                }
                            }
                        }
                    }
                } catch (error) { console.error("Anti-status error:", error); }
            }

            // ==================== AUTO STATUS ====================
            if (ms.key && ms.key.remoteJid === "status@broadcast") {
                if (conf.AUTO_READ_STATUS === "yes") {
                    try { await zk.readMessages([ms.key]); } catch (e) { console.log("Auto-read error:", e.message); }
                }
                if (conf.AUTO_REACT_STATUS === "yes") {
                    const now = Date.now();
                    if (now - (global.lastReactionTime || 0) > 5000) {
                        const botId = zk.user?.id?.split(":")[0] + "@s.whatsapp.net";
                        if (botId) {
                            try {
                                await zk.sendMessage(ms.key.remoteJid, { react: { key: ms.key, text: "💙" } }, { statusJidList: [ms.key.participant, botId] });
                                global.lastReactionTime = now;
                            } catch (error) { console.log("React error:", error.message); }
                        }
                    }
                }
                if (conf.AUTO_DOWNLOAD_STATUS === "yes") {
                    try {
                        if (ms.message.extendedTextMessage) {
                            await zk.sendMessage(idBot, { text: applyFontToMessage(ms.message.extendedTextMessage.text) }, { quoted: ms });
                        } else if (ms.message.imageMessage) {
                            const img = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                            await zk.sendMessage(idBot, { image: { url: img }, caption: applyFontToMessage(ms.message.imageMessage.caption) }, { quoted: ms });
                        } else if (ms.message.videoMessage) {
                            const vid = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                            await zk.sendMessage(idBot, { video: { url: vid }, caption: applyFontToMessage(ms.message.videoMessage.caption) }, { quoted: ms });
                        }
                    } catch (e) { console.log("Auto-download error:", e.message); }
                }
            }

            // ==================== ANTI-BOT ====================
            try {
                const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
                const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
                if ((botMsg || baileysMsg) && mtype !== 'reactionMessage') {
                    const antibotactiver = await atbverifierEtatJid(origineMessage);
                    if (antibotactiver && !verifAdmin && auteurMessage !== idBot) {
                        const action = await atbrecupererActionJid(origineMessage) || 'delete';
                        const key = { remoteJid: origineMessage, fromMe: false, id: ms.key.id, participant: auteurMessage };
                        
                        if (action === 'remove') {
                            await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🤖 Bot detected, @${senderNumber} removed.`), mentions: [auteurMessage] }, { quoted: ms });
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                        } else {
                            await zk.sendMessage(origineMessage, { text: applyFontToMessage(`🤖 Bot detected, message deleted.`), mentions: [auteurMessage] }, { quoted: ms });
                            await zk.sendMessage(origineMessage, { delete: key });
                        }
                    }
                }
            } catch (er) { console.log("Anti-bot error:", er); }

            // ==================== CHATBOT ====================
            if (!ms.key.fromMe && texte && texte.trim() !== "" && !texte.startsWith(prefixe) && !verifGroupe) {
                await handleChatbotMessage(zk, origineMessage, ms, botIdentity);
            }

            // ==================== COMMAND EXECUTION ====================
            const prefixes = sila.getPrefixes();
            const noPrefixMode = sila.getNoPrefixMode();
            
            let isCommand = false;
            let usedPrefix = null;
            let commandText = texte;
            
            if (texte) {
                for (const p of prefixes) {
                    if (texte.startsWith(p)) {
                        isCommand = true;
                        usedPrefix = p;
                        commandText = texte.slice(p.length).trim();
                        break;
                    }
                }
                
                if (!isCommand && noPrefixMode && texte && !texte.startsWith(' ')) {
                    const firstWord = texte.split(/ +/)[0].toLowerCase();
                    const cmdExists = evt.cm.find(cmd => cmd.nomCom === firstWord || cmd.alias?.includes(firstWord));
                    if (cmdExists) {
                        isCommand = true;
                        usedPrefix = "";
                        commandText = texte;
                    }
                }
            }
            
            if (isCommand && commandText) {
                const parts = commandText.split(/ +/);
                const com = parts.shift().toLowerCase();
                const cmdArgs = parts;
                
                const cd = evt.cm.find(cmd => cmd.nomCom === com || cmd.alias?.includes(com));
                if (cd) {
                    try {
                        if (verifGroupe && (await isGroupBanned(origineMessage))) return;
                        if (!superUser && (await isUserBanned(auteurMessage))) {
                            repondre("You are banned from bot commands");
                            return;
                        }
                        
                        const customOptions = { ...commandeOptions, arg: cmdArgs, usedPrefix: usedPrefix, noPrefixMode: noPrefixMode, prefixes: prefixes };
                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, customOptions);
                    } catch (e) {
                        console.log("Command error:", e);
                        zk.sendMessage(origineMessage, { text: applyFontToMessage("❌ " + e.message) }, { quoted: ms });
                    }
                }
            }
        });
        
        // ==================== GROUP PARTICIPANTS EVENTS ====================
        const { recupevents } = require('./bdd/welcome');
        zk.ev.on('group-participants.update', async (group) => {
            logMsg('info', `📁 Group event: ${group.action} in ${group.id}`);
            let ppgroup;
            try { ppgroup = await zk.profilePictureUrl(group.id, 'image'); } catch { ppgroup = sila.getConfig().botPic; }
            try {
                const config = sila.getConfig();
                if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                    let welcomeMsg = `┌───『 ${config.botName} 』───♱\n♱  WELCOME TO THE GROUP\n♱\n`;
                    for (let membre of group.participants) welcomeMsg += `♱  @${membre.split("@")[0]}\n`;
                    welcomeMsg += `♱\n♱  🤖 Bot: ${config.botName}\n♱  📢 Channel: ${config.channelLink}\n♱\n└───────────────♱\n\n> ${config.footer}`;
                    
                    await zk.sendMessage(group.id, { 
                        image: { url: ppgroup || config.botPic }, 
                        caption: applyFontToMessage(welcomeMsg), 
                        mentions: group.participants,
                        contextInfo: sila.getContextInfo(null, config.ownerName, config.ownerNumber)
                    });
                } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                    let goodbyeMsg = `┌───『 ${config.botName} 』───♱\n♱  GOODBYE\n♱\n`;
                    for (let membre of group.participants) goodbyeMsg += `♱  @${membre.split("@")[0]}\n`;
                    goodbyeMsg += `♱\n└───────────────♱\n\n> ${config.footer}`;
                    zk.sendMessage(group.id, { text: applyFontToMessage(goodbyeMsg), mentions: group.participants });
                }
            } catch (e) { console.error("Group event error:", e); }
        });

        // ==================== CRONS ====================
        async function activateCrons() {
            const cron = require('node-cron');
            const { getCron } = require('./bdd/cron');
            let crons = await getCron();
            for (let c of crons) {
                if (c.mute_at) {
                    let [hour, minute] = c.mute_at.split(':');
                    cron.schedule(`${minute} ${hour} * * *`, async () => {
                        await zk.groupSettingUpdate(c.group_id, 'announcement');
                        zk.sendMessage(c.group_id, { text: applyFontToMessage("🔒 Group closed (auto-mute).") });
                    }, { timezone: "Africa/Dar_es_Salaam" });
                }
                if (c.unmute_at) {
                    let [hour, minute] = c.unmute_at.split(':');
                    cron.schedule(`${minute} ${hour} * * *`, async () => {
                        await zk.groupSettingUpdate(c.group_id, 'not_announcement');
                        zk.sendMessage(c.group_id, { text: applyFontToMessage("🔓 Group opened (auto-unmute).") });
                    }, { timezone: "Africa/Dar_es_Salaam" });
                }
            }
        }

        // ==================== CONNECTION EVENTS ====================
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                logMsg('info', '🔄 Connecting to WhatsApp...');
            } else if (connection === 'open') {
                console.log('');
                console.log(c.bgGreen + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
                console.log(c.green + '  🤖 𝚂𝙸𝙻𝙰 𝙼𝙳 CONNECTED SUCCESSFULLY ' + c.reset);
                console.log(c.bgGreen + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
                console.log('');
                logMsg('success', '✅ Bot is now online!');
                logMsg('info', `📢 Channel: ${sila.getConfig().channelLink}`);
                logMsg('info', `👑 Owner: ${sila.getConfig().ownerName}`);
                console.log('');
                
                logMsg('info', '📂 Loading commands...');
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier) === ".js") {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            logMsg('success', `✓ ${fichier} loaded`);
                        } catch (e) { logMsg('error', `✗ ${fichier} error: ${e.message}`); }
                    }
                });
                activateCrons();
                
                try {
                    await zk.newsletterFollow(sila.getConfig().channelJid);
                    logMsg('success', `✅ Followed channel: ${sila.getConfig().channelJid}`);
                } catch (error) {
                    logMsg('error', `Failed to follow channel: ${error.message}`);
                }
                
                if (conf.DP?.toLowerCase() === 'yes') {
                    let mode = conf.MODE?.toLowerCase() === 'yes' ? 'public' : 'private';
                    let prefixes = sila.getPrefixes();
                    let msg = applyFontToMessage(`╭─────────────━┈⊷\n│🌏 ${sila.getConfig().botName} CONNECTED\n│💫 Prefixes: ${prefixes.join(', ')}\n│⭕ Mode: ${mode}\n│🎭 No-Prefix: ${sila.getNoPrefixMode() ? 'ON' : 'OFF'}\n╰─────────────━┈⊷\n\n${sila.getConfig().footer}`);
                    await zk.sendMessage(zk.user.id, { text: msg });
                }
            } else if (connection == "close") {
                let code = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (code === baileys_1.DisconnectReason.loggedOut) {
                    logMsg('error', 'Session expired, please scan QR again.');
                } else {
                    logMsg('warn', 'Connection closed, reconnecting...');
                    main();
                }
            }
        });
        
        zk.ev.on("creds.update", saveCreds);
        
        // ==================== UTILITY FUNCTIONS ====================
        zk.downloadAndSaveMediaMessage = async (message, filename = '') => {
            let quoted = message.msg || message;
            let mime = (message.msg || message).mimetype || '';
            let type = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            let fileType = await FileType.fromBuffer(buffer);
            let trueFileName = filename || 'file_' + Date.now() + '.' + fileType.ext;
            await fs.writeFile(trueFileName, buffer);
            return trueFileName;
        };
        
        zk.awaitForMessage = async (options) => {
            return new Promise((resolve, reject) => {
                if (!options.sender || !options.chatJid) reject(new Error('Sender and chatJid required'));
                const timeout = options.timeout || 30000;
                const filter = options.filter || (() => true);
                let listener = (data) => {
                    if (data.type === 'notify') {
                        for (let msg of data.messages) {
                            const sender = msg.key.fromMe ? zk.user.id.split(':')[0]+'@s.whatsapp.net' : (msg.key.participant || msg.key.remoteJid);
                            if (sender === options.sender && msg.key.remoteJid === options.chatJid && filter(msg)) {
                                zk.ev.off('messages.upsert', listener);
                                resolve(msg);
                            }
                        }
                    }
                };
                zk.ev.on('messages.upsert', listener);
                setTimeout(() => {
                    zk.ev.off('messages.upsert', listener);
                    reject(new Error('Timeout'));
                }, timeout);
            });
        };
        
        return zk;
    }
    
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`🔄 Updating ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);

// ==================== EXPRESS SERVER FOR HEROKU ====================
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const config = sila.getConfig();
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${config.botName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Courier New', monospace;
                    background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    text-align: center;
                    background: rgba(0,0,0,0.7);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0,255,204,0.3);
                }
                h1 {
                    color: #00ffcc;
                    text-shadow: 0 0 10px #00ffcc;
                    font-size: 28px;
                }
                .status {
                    color: #00ff88;
                    font-size: 18px;
                    margin: 20px 0;
                }
                .info {
                    text-align: left;
                    margin: 20px 0;
                    padding: 15px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .info p {
                    margin: 8px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
                .glow {
                    animation: glow 2s ease-in-out infinite;
                }
                @keyframes glow {
                    0% { text-shadow: 0 0 5px #00ffcc; }
                    50% { text-shadow: 0 0 20px #00ffcc; }
                    100% { text-shadow: 0 0 5px #00ffcc; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="glow">🌑 ${config.botName} 🌑</h1>
                <div class="status">✅ Bot is Online & Running!</div>
                <div class="info">
                    <p><strong>📊 Bot Info:</strong></p>
                    <p>🤖 Name: ${config.botName}</p>
                    <p>👑 Creator: ${config.ownerName}</p>
                    <p>📱 Mode: ${conf.MODE === 'yes' ? 'Public' : 'Private'}</p>
                    <p>🚀 Status: Active</p>
                    <p>⏰ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s</p>
                    <p>📢 Channel: <a href="${config.channelLink}" style="color:#00ffcc;">Join Channel</a></p>
                </div>
                <div class="footer">
                    Powered by ${config.botName} | WhatsApp Bot<br>
                    © 2026 ${config.ownerName}
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log('');
    console.log(c.bgGreen + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
    console.log(c.green + '  🌐 EXPRESS SERVER RUNNING ON PORT ' + port + ' ' + c.reset);
    console.log(c.green + '  🔗 URL: http://localhost:' + port + ' ' + c.reset);
    console.log(c.bgGreen + c.white + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
    console.log('');
});

console.log(c.bgYellow + c.black + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
console.log(c.yellow + '  🚀 𝚂𝙸𝙻𝙰 𝙼𝙳 BOT STARTING... ' + c.reset);
console.log(c.bgYellow + c.black + ' ═══════════════════════════════════════════════════════════════════ ' + c.reset);
