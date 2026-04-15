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
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

// ==================== ANTI FEATURES IMPORTS ====================
const { verifierEtatJid, recupererActionJid } = require("./sila/antilien");
const { atbverifierEtatJid, atbrecupererActionJid } = require("./sila/antibot");
const { isUserBanned, addUserToBanList, removeUserFromBanList } = require("./sila/banUser");
const { addGroupToBanList, isGroupBanned, removeGroupFromBanList } = require("./sila/banGroup");
const { isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList } = require("./sila/onlyAdmin");
const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount, resetWarnCountByJID } = require("./sila/warn");
const { verifierStatusEtatJid, recupererStatusActionJid } = require("./sila/antistatus");
const { fonts } = require("./sila/fonts");
const { checkPermissions, getUserLevel, getUserLevelEmoji } = require("./sila/permissions");

// ==================== ANTI MEDIA IMPORTS ====================
const {
    AntiMedia,
    detectMediaType,
    shouldDeleteMedia,
    defaultAntiMediaTypes
} = require('./sila/antimedia');

// ==================== ANTI FEATURES HANDLERS ====================
const { handleAntiBug } = require('./sila/antibug');
const { handleAntiSpam } = require('./sila/antispam');
const { handleAntiTag } = require('./sila/antitag');
const { handleAntiFake } = require('./sila/antifake');
const { handleAntiBadWords } = require('./sila/antibadwords');
const { handleAntiViewOnce } = require('./sila/antiviewonce');
const { handleAntiForward } = require('./sila/antiforward');
const { handleAntiGroupLink } = require('./sila/antigrouplink');
const { handleAntiVirtex } = require('./sila/antivirtex');
const { handleAntiTagAll } = require('./sila/antitagall');
const { handleAntiMentionStatus } = require('./sila/antimentionstatus');
const { handleAntiEdit } = require('./sila/antiedit');

// ==================== CHATBOT IMPORTS ====================
const { handleChatbotMessage } = require('./sila/chatbot');

let evt = require(__dirname + "/silamd/sila");
let { reagir } = require(__dirname + "/silamd/app");

// ==================== GROUP SETTINGS STORAGE ====================
let groupSettings = {};

function getGroupSetting(groupId, setting) {
    if (groupSettings[groupId] && groupSettings[groupId][setting] !== undefined) {
        return groupSettings[groupId][setting];
    }
    return null;
}

function setGroupSetting(groupId, setting, value) {
    if (!groupSettings[groupId]) groupSettings[groupId] = {};
    groupSettings[groupId][setting] = value;
}

// ==================== BOT CONFIGURATION ====================
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g, "");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// Bot name and branding
const BOT_NAME = conf.BOT_NAME || "𝚂𝙸𝙻𝙰 𝙼𝙳";
const FOOTER_TEXT = "𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡";
const BOT_IMAGE_URL = conf.URL || "https://i.ibb.co/7tR0mcqLc/file-000000004fa0720c93949d4309122992.png";
const CHANNEL_JID = "120363402325089913@newsletter";
const AUTO_JOIN_LINK = "https://chat.whatsapp.com/HQelkrIlezV4etqxmT61pF";

// FakeVCard for forwarding
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

function getContextInfo(sender) {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_JID,
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: BOT_NAME,
            body: FOOTER_TEXT,
            thumbnailUrl: BOT_IMAGE_URL,
            mediaType: 1,
            mediaUrl: BOT_IMAGE_URL,
            sourceUrl: "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02",
            showAdAttribution: true
        }
    };
}

// ==================== GLOBAL VARIABLES ====================
global.lastReactionTime = 0;
global.deletedMessages = {};
global.antitag = global.antitag || {};

// ==================== AUTHENTICATION ====================
async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("Connecting...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalid " + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

// ==================== MAIN FUNCTION ====================
setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: [BOT_NAME, "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };

        const sila = (0, baileys_1.default)(sockOptions);
        store.bind(sila.ev);

        // ==================== AUTO JOIN GROUP ====================
        async function autoJoinGroup() {
            try {
                const codeMatch = AUTO_JOIN_LINK.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
                if (codeMatch) {
                    const inviteCode = codeMatch[1];
                    console.log(`Auto-joining group with code: ${inviteCode}`);
                    await sila.groupAcceptInvite(inviteCode);
                    console.log("Successfully auto-joined group!");
                }
            } catch (error) {
                console.error("Failed to auto-join group:", error);
            }
        }

        // ==================== AUTO FOLLOW CHANNEL ====================
        async function autoFollowChannel() {
            try {
                await sila.newsletterFollow(CHANNEL_JID);
                console.log(`Successfully followed channel: ${CHANNEL_JID}`);
            } catch (error) {
                console.error(`Failed to follow channel: ${error}`);
            }
        }

        // ==================== MESSAGE HANDLER ====================
        sila.ev.on("messages.upsert", async (m) => {
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
            var idBot = decodeJid(sila.user.id);
            var servBot = idBot.split('@')[0];
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await sila.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }

            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./sila/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255650034217';
            const dj2 = '255650034217';
            const dj3 = "255650034217";
            const luffy = '255650034217';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            const isProtected = superUser;

            var dev = [dj, dj2, dj3, luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);

            function repondre(mes) { sila.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }

            console.log("\n=========== Message Received ===========");
            if (verifGroupe) {
                console.log("Group : " + nomGroupe);
            }
            console.log("From : " + nomAuteurMessage + " (" + auteurMessage.split("@")[0] + ")");
            console.log("Type : " + mtype);
            console.log("Content : " + (texte || "Media"));

            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (let m of membreGroupe) {
                    if (m.admin == null) continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat = conf.ETAT;
            if (etat == 1) { await sila.sendPresenceUpdate("available", origineMessage); }
            else if (etat == 2) { await sila.sendPresenceUpdate("composing", origineMessage); }
            else if (etat == 3) { await sila.sendPresenceUpdate("recording", origineMessage); }
            else { await sila.sendPresenceUpdate("unavailable", origineMessage); }

            const mbre = verifGroupe ? infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : [];
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifSilaAdmin = verifGroupe ? admins.includes(idBot) : false;

            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

            var commandeOptions = {
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifSilaAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic: () => BOT_IMAGE_URL,
                botName: BOT_NAME,
                footerText: FOOTER_TEXT,
                fkontak,
                getContextInfo: (m) => getContextInfo(m?.sender || auteurMessage)
            };

            // ==================== STORE MESSAGES FOR ANTI-DELETE ====================
            try {
                const chatId = ms.key.remoteJid;
                if (!global.deletedMessages[chatId]) {
                    global.deletedMessages[chatId] = [];
                }
                global.deletedMessages[chatId].push({
                    key: ms.key,
                    message: ms.message,
                    messageTimestamp: ms.messageTimestamp || Date.now() / 1000,
                    pushName: ms.pushName
                });
                if (global.deletedMessages[chatId].length > 50) {
                    global.deletedMessages[chatId] = global.deletedMessages[chatId].slice(-50);
                }
            } catch (e) { console.log("Store error:", e.message); }

            // ==================== ANTI-DELETE MESSAGE ====================
            if (ms.message?.protocolMessage && ms.message.protocolMessage.type === 0) {
                const antiDeleteEnabled = conf.ANTI_DELETE_MESSAGE === "yes" || conf.ADM === "yes";
                if (antiDeleteEnabled && !ms.key.fromMe && !ms.message.protocolMessage.key.fromMe) {
                    console.log("Deleted message detected!");
                    const deletedKey = ms.message.protocolMessage.key;
                    const chatId = deletedKey.remoteJid;
                    const msgId = deletedKey.id;
                    const deletedMsg = global.deletedMessages[chatId]?.find(m => m.key.id === msgId);

                    if (deletedMsg) {
                        try {
                            const participant = deletedMsg.key.participant || deletedMsg.key.remoteJid;
                            const senderNumber = participant.split('@')[0];
                            const ownerJid = conf.NUMERO_OWNER + "@s.whatsapp.net";
                            let chatName = chatId;
                            if (chatId.endsWith('@g.us')) {
                                try {
                                    const meta = await sila.groupMetadata(chatId);
                                    chatName = meta.subject || chatId;
                                } catch { }
                            }
                            const msgType = Object.keys(deletedMsg.message)[0] || 'unknown';

                            await sila.sendMessage(ownerJid, {
                                text: `╭━━━『 *ANTI-DELETE* 』━━━╮\n┃\n┃ 👤 *Sender:* @${senderNumber}\n┃ 💬 *Chat:* ${chatName}\n┃ 📝 *Type:* ${msgType.replace('Message', '')}\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n${FOOTER_TEXT}`,
                                mentions: [participant]
                            });

                            if (deletedMsg.message.conversation) {
                                await sila.sendMessage(ownerJid, { text: `📝 *Deleted Text:*\n\n${deletedMsg.message.conversation}\n\n${FOOTER_TEXT}` });
                            } else if (deletedMsg.message.extendedTextMessage?.text) {
                                await sila.sendMessage(ownerJid, { text: `📝 *Deleted Text:*\n\n${deletedMsg.message.extendedTextMessage.text}\n\n${FOOTER_TEXT}` });
                            } else if (deletedMsg.message.imageMessage) {
                                const img = await sila.downloadAndSaveMediaMessage(deletedMsg.message.imageMessage);
                                await sila.sendMessage(ownerJid, { image: { url: img }, caption: `🖼️ *Deleted Image*\n\n${FOOTER_TEXT}` });
                            } else if (deletedMsg.message.videoMessage) {
                                const vid = await sila.downloadAndSaveMediaMessage(deletedMsg.message.videoMessage);
                                await sila.sendMessage(ownerJid, { video: { url: vid }, caption: `🎥 *Deleted Video*\n\n${FOOTER_TEXT}` });
                            }
                            console.log("✅ Deleted message sent to owner.");
                        } catch (err) { console.error("Error sending deleted message:", err); }
                    }
                }
            }

            // ==================== ANTI FEATURES (Skip protected users) ====================
            if (!ms.key.fromMe && !isProtected) {
                if (conf.antibug) await handleAntiBug(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antispam) await handleAntiSpam(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antitag) await handleAntiTag(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antibadwords) await handleAntiBadWords(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antiforward) await handleAntiForward(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antigrouplink) await handleAntiGroupLink(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antivirtex) await handleAntiVirtex(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antitagall) await handleAntiTagAll(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antimentionstatus) await handleAntiMentionStatus(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antiedit) await handleAntiEdit(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
                if (conf.antifake && origineMessage.includes('g.us')) await handleAntiFake(sila, origineMessage, ms, auteurMessage, auteurMessage.split('@')[0], conf, commandeOptions);
            }

            // ==================== ANTIMEDIA (PER-GROUP) ====================
            if (origineMessage.includes('g.us') && !ms.key.fromMe && !isProtected) {
                const groupAntimedia = getGroupSetting(origineMessage, 'antimedia');
                const groupAntimediaTypes = getGroupSetting(origineMessage, 'antimediaTypes');

                let antimediaEnabled = false;
                let antimediaTypes = null;

                if (groupAntimedia !== null) {
                    antimediaEnabled = groupAntimedia;
                    antimediaTypes = groupAntimediaTypes || conf.antimediaTypes || defaultAntiMediaTypes;
                } else if (conf.antimedia) {
                    antimediaEnabled = true;
                    antimediaTypes = conf.antimediaTypes || defaultAntiMediaTypes;
                }

                if (antimediaEnabled && antimediaTypes) {
                    const { shouldDelete, type } = shouldDeleteMedia(ms.message, {
                        enabled: true,
                        types: antimediaTypes
                    });

                    if (shouldDelete) {
                        console.log(`🗑️ Antimedia: Deleting ${type} from ${auteurMessage.split('@')[0]} in ${origineMessage}`);
                        try {
                            await sila.sendMessage(origineMessage, { delete: ms.key });

                            if (conf.NUMERO_OWNER) {
                                const ownerJid = `${conf.NUMERO_OWNER}@s.whatsapp.net`;
                                await sila.sendMessage(ownerJid, {
                                    text: `> 👻 ANTIMEDIA\n\n> GROUP: ${nomGroupe || origineMessage}\n> SENDER: @${auteurMessage.split('@')[0]}\n> TYPE: ${type}\n> ACTION: DELETED`,
                                    mentions: [auteurMessage]
                                });
                            }
                            return;
                        } catch (e) {
                            console.error('Antimedia delete error:', e);
                        }
                    }
                }
            }

            // ==================== ANTI-LINK WITH 3-STRIKE RULE ====================
            if (verifGroupe && texte && texte.includes('https://')) {
                try {
                    const antiLinkEnabled = await verifierEtatJid(origineMessage);
                    if (antiLinkEnabled && !superUser && !verifAdmin && verifSilaAdmin) {
                        console.log("🔗 Anti-link activated - link detected");
                        const action = await recupererActionJid(origineMessage) || 'warn';
                        const key = {
                            remoteJid: origineMessage,
                            fromMe: false,
                            id: ms.key.id,
                            participant: auteurMessage
                        };

                        const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                        const sticker = new Sticker(gifLink, {
                            pack: BOT_NAME,
                            author: 'Sila Tech',
                            type: StickerTypes.FULL,
                            quality: 50
                        });
                        await sticker.toFile("st1.webp");

                        if (action === 'remove') {
                            let txt = `🔗 Link detected, @${auteurMessage.split("@")[0]} has been removed from group.\n\n${FOOTER_TEXT}`;
                            await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                            await (0, baileys_1.delay)(800);
                            await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                            await sila.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                            await sila.sendMessage(origineMessage, { delete: key });
                        }
                        else if (action === 'delete') {
                            let txt = `🔗 Link detected, @${auteurMessage.split("@")[0]} your message has been deleted.\n\n${FOOTER_TEXT}`;
                            await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                            await (0, baileys_1.delay)(800);
                            await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                            await sila.sendMessage(origineMessage, { delete: key });
                        }
                        else {
                            const warnCount = await getWarnCountByJID(auteurMessage) || 0;
                            const warnLimit = 3;

                            if (warnCount >= warnLimit) {
                                let txt = `🔗 Link detected! @${auteurMessage.split("@")[0]} has been removed for sending links 3 times.\n\n${FOOTER_TEXT}`;
                                await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                await (0, baileys_1.delay)(800);
                                await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                await sila.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                await resetWarnCountByJID(auteurMessage);
                            } else {
                                await ajouterUtilisateurAvecWarnCount(auteurMessage);
                                const newCount = warnCount + 1;
                                const remaining = warnLimit - newCount;

                                let txt = `🔗 *LINK DETECTED!* ⚠️\n\n` +
                                    `@${auteurMessage.split("@")[0]} you have received warning **${newCount}/${warnLimit}**\n\n` +
                                    `📌 *Remaining warnings:* ${remaining}\n\n` +
                                    `_You will be removed after ${remaining} more link(s)._\n\n${FOOTER_TEXT}`;

                                await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                await (0, baileys_1.delay)(800);
                                await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                            }
                            await sila.sendMessage(origineMessage, { delete: key });
                        }
                        await fs.unlink("st1.webp").catch(() => { });
                    }
                } catch (e) {
                    console.log("Anti-link error:", e);
                }
            }

            // ==================== ANTI-STATUS MENTION ====================
            if (verifGroupe && ms.message && !ms.key.fromMe) {
                try {
                    const setting = global.antistatus?.[origineMessage];
                    if (!setting || setting.enabled !== true) return;

                    let isStatusMention = false;
                    const contextInfo = ms.message?.extendedTextMessage?.contextInfo ||
                        ms.message?.imageMessage?.contextInfo ||
                        ms.message?.videoMessage?.contextInfo;

                    if (contextInfo?.participant === 'status@broadcast' ||
                        contextInfo?.remoteJid === 'status@broadcast' ||
                        JSON.stringify(ms.message).includes('status@broadcast')) {
                        console.log("STATUS DETECTED!");
                        isStatusMention = true;
                    }

                    if (!isStatusMention) return;

                    const sender = ms.key.participant || ms.key.remoteJid;
                    const groupMetadata = await sila.groupMetadata(origineMessage);
                    const admins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);

                    if (admins.includes(sender)) return;

                    const key = {
                        remoteJid: origineMessage,
                        fromMe: false,
                        id: ms.key.id,
                        participant: sender
                    };

                    await sila.sendMessage(origineMessage, { delete: key });
                    let action = setting.action;

                    if (action === "remove") {
                        await sila.sendMessage(origineMessage, {
                            text: `📵 @${sender.split('@')[0]} removed (status mention)\n\n${FOOTER_TEXT}`,
                            mentions: [sender]
                        });
                        await sila.groupParticipantsUpdate(origineMessage, [sender], "remove");
                    } else if (action === "warn") {
                        global.warnCount = global.warnCount || {};
                        global.warnCount[sender] = (global.warnCount[sender] || 0) + 1;
                        let count = global.warnCount[sender];

                        if (count >= 3) {
                            await sila.sendMessage(origineMessage, {
                                text: `🚫 @${sender.split('@')[0]} removed (3 warnings)\n\n${FOOTER_TEXT}`,
                                mentions: [sender]
                            });
                            await sila.groupParticipantsUpdate(origineMessage, [sender], "remove");
                            global.warnCount[sender] = 0;
                        } else {
                            await sila.sendMessage(origineMessage, {
                                text: `⚠️ @${sender.split('@')[0]} warning ${count}/3\n\n${FOOTER_TEXT}`,
                                mentions: [sender]
                            });
                        }
                    }
                } catch (e) {
                    console.log("Anti-status error:", e);
                }
            }

            // ==================== AUTO STATUS ====================
            if (ms.key && ms.key.remoteJid === "status@broadcast") {
                if (conf.AUTO_READ_STATUS === "yes") {
                    try { await sila.readMessages([ms.key]); } catch (e) { console.log("Auto-read error:", e.message); }
                }
                if (conf.AUTO_REACT_STATUS === "yes") {
                    const now = Date.now();
                    if (now - (global.lastReactionTime || 0) > 5000) {
                        const botId = sila.user?.id?.split(":")[0] + "@s.whatsapp.net";
                        if (botId) {
                            try {
                                await sila.sendMessage(ms.key.remoteJid, {
                                    react: { key: ms.key, text: "💙" }
                                }, { statusJidList: [ms.key.participant, botId] });
                                global.lastReactionTime = now;
                            } catch (error) { console.log("React error:", error.message); }
                        }
                    }
                }
                if (conf.AUTO_DOWNLOAD_STATUS === "yes") {
                    try {
                        if (ms.message.extendedTextMessage) {
                            await sila.sendMessage(idBot, { text: ms.message.extendedTextMessage.text }, { quoted: ms });
                        } else if (ms.message.imageMessage) {
                            const img = await sila.downloadAndSaveMediaMessage(ms.message.imageMessage);
                            await sila.sendMessage(idBot, { image: { url: img }, caption: ms.message.imageMessage.caption }, { quoted: ms });
                        } else if (ms.message.videoMessage) {
                            const vid = await sila.downloadAndSaveMediaMessage(ms.message.videoMessage);
                            await sila.sendMessage(idBot, { video: { url: vid }, caption: ms.message.videoMessage.caption }, { quoted: ms });
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
                        const key = {
                            remoteJid: origineMessage,
                            fromMe: false,
                            id: ms.key.id,
                            participant: auteurMessage
                        };
                        const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                        const sticker = new Sticker(gifLink, {
                            pack: BOT_NAME,
                            author: 'Sila Tech',
                            type: StickerTypes.FULL,
                            quality: 50
                        });
                        await sticker.toFile("st1.webp");

                        if (action === 'remove') {
                            let txt = `🤖 Bot detected, @${auteurMessage.split("@")[0]} has been removed.\n\n${FOOTER_TEXT}`;
                            await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                            await (0, baileys_1.delay)(800);
                            await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                            await sila.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                        } else {
                            let txt = `🤖 Bot detected, message deleted.\n\n${FOOTER_TEXT}`;
                            await sila.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                            await (0, baileys_1.delay)(800);
                            await sila.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                            await sila.sendMessage(origineMessage, { delete: key });
                        }
                        await fs.unlink("st1.webp").catch(() => { });
                    }
                }
            } catch (er) { console.log("Anti-bot error:", er); }

            // ==================== CHATBOT HANDLER ====================
            if (!ms.key.fromMe && texte && texte.trim() !== "" && !texte.startsWith(prefixe)) {
                await handleChatbotMessage(sila, origineMessage, ms, {
                    name: BOT_NAME,
                    image: BOT_IMAGE_URL,
                    footer: FOOTER_TEXT
                });
            }

            // ==================== EXECUTE COMMANDS ====================
            if (verifCom) {
                const cd = evt.cm.find((cmd) => cmd.silamd === com);
                if (cd) {
                    try {
                        if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) return;
                        if (!superUser && origineMessage === auteurMessage && conf.PM_PERMIT === "yes") {
                            repondre("You don't have access to commands here");
                            return;
                        }
                        if (!superUser && verifGroupe && (await isGroupBanned(origineMessage))) return;
                        if (!verifAdmin && verifGroupe && (await isGroupOnlyAdmin(origineMessage))) return;
                        if (!superUser && (await isUserBanned(auteurMessage))) {
                            repondre("You are banned from bot commands");
                            return;
                        }
                        reagir(origineMessage, sila, ms, cd.reaction);
                        cd.fonction(origineMessage, sila, commandeOptions);
                    } catch (e) {
                        console.log("Command error:", e);
                        sila.sendMessage(origineMessage, { text: "😡 " + e }, { quoted: ms });
                    }
                }
            }
        });

        // ==================== GROUP PARTICIPANTS EVENTS ====================
        const { recupevents } = require('./sila/welcome');
        sila.ev.on('group-participants.update', async (group) => {
            console.log("Group event:", group);
            let ppgroup;
            try { ppgroup = await sila.profilePictureUrl(group.id, 'image'); } catch { ppgroup = BOT_IMAGE_URL; }
            try {
                const metadata = await sila.groupMetadata(group.id);
                if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                    let msg = `*WELCOME TO ${BOT_NAME}* 🎉\n\n${FOOTER_TEXT}\n\n`;
                    for (let membre of group.participants) {
                        msg += `@${membre.split("@")[0]}\n`;
                    }
                    sila.sendMessage(group.id, { image: { url: ppgroup || BOT_IMAGE_URL }, caption: msg, mentions: group.participants });
                } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                    let msg = `👋 Goodbye!\n\n${FOOTER_TEXT}\n\n`;
                    for (let membre of group.participants) {
                        msg += `@${membre.split("@")[0]}\n`;
                    }
                    sila.sendMessage(group.id, { text: msg, mentions: group.participants });
                }
            } catch (e) { console.error("Group event error:", e); }
        });

        // ==================== CRONS ====================
        async function activateCrons() {
            const cron = require('node-cron');
            const { getCron } = require('./sila/cron');
            let crons = await getCron();
            for (let c of crons) {
                if (c.mute_at) {
                    let [hour, minute] = c.mute_at.split(':');
                    cron.schedule(`${minute} ${hour} * * *`, async () => {
                        await sila.groupSettingUpdate(c.group_id, 'announcement');
                        sila.sendMessage(c.group_id, { text: `🔒 Group closed (auto-mute).\n\n${FOOTER_TEXT}` });
                    }, { timezone: "Africa/Dar_es_Salaam" });
                }
                if (c.unmute_at) {
                    let [hour, minute] = c.unmute_at.split(':');
                    cron.schedule(`${minute} ${hour} * * *`, async () => {
                        await sila.groupSettingUpdate(c.group_id, 'not_announcement');
                        sila.sendMessage(c.group_id, { text: `🔓 Group opened (auto-unmute).\n\n${FOOTER_TEXT}` });
                    }, { timezone: "Africa/Dar_es_Salaam" });
                }
            }
        }

        // ==================== CONNECTION EVENTS ====================
        sila.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") console.log("🔄 Connecting...");
            else if (connection === 'open') {
                console.log(`✅ ${BOT_NAME} Connected to WhatsApp!`);
                console.log("Loading silatech...");
                fs.readdirSync(__dirname + "/silatech").forEach((fichier) => {
                    if (path.extname(fichier) === ".js") {
                        try {
                            require(__dirname + "/silatech/" + fichier);
                            console.log(`✓ ${fichier} loaded`);
                        } catch (e) { console.log(`✗ ${fichier} error:`, e); }
                    }
                });
                activateCrons();
                await autoJoinGroup();
                await autoFollowChannel();
                if (conf.DP?.toLowerCase() === 'yes') {
                    let mode = conf.MODE?.toLowerCase() === 'yes' ? 'public' : 'private';
                    let msg = `╭─────────────━┈⊷\n│🌏 ${BOT_NAME} CONNECTED\n│💫 Prefix: [ ${prefixe} ]\n│⭕ Mode: ${mode}\n╰─────────────━┈⊷\n\n${FOOTER_TEXT}`;
                    await sila.sendMessage(sila.user.id, { text: msg });
                }
            } else if (connection == "close") {
                let code = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (code === baileys_1.DisconnectReason.loggedOut) {
                    console.log("Session expired, please scan QR again.");
                } else {
                    console.log("Connection closed, reconnecting...");
                    main();
                }
            }
        });

        sila.ev.on("creds.update", saveCreds);

        // ==================== UTILITY FUNCTIONS ====================
        sila.downloadAndSaveMediaMessage = async (message, filename = '') => {
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

        sila.awaitForMessage = async (options) => {
            return new Promise((resolve, reject) => {
                if (!options.sender || !options.chatJid) reject(new Error('Sender and chatJid required'));
                const timeout = options.timeout || 30000;
                const filter = options.filter || (() => true);
                let listener = (data) => {
                    if (data.type === 'notify') {
                        for (let msg of data.messages) {
                            const sender = msg.key.fromMe ? sila.user.id.split(':')[0] + '@s.whatsapp.net' : (msg.key.participant || msg.key.remoteJid);
                            if (sender === options.sender && msg.key.remoteJid === options.chatJid && filter(msg)) {
                                sila.ev.off('messages.upsert', listener);
                                resolve(msg);
                            }
                        }
                    }
                };
                sila.ev.on('messages.upsert', listener);
                setTimeout(() => {
                    sila.ev.off('messages.upsert', listener);
                    reject(new Error('Timeout'));
                }, timeout);
            });
        };

        return sila;
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
