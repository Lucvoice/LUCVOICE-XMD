const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = { 
    // Session & Prefix
    session: process.env.SESSION_ID || 'zokk',
    PREFIXE: process.env.PREFIX || ".",
    
    // Owner Information
    OWNER_NAME: process.env.OWNER_NAME || "Luka IT",
    NOM_OWNER: process.env.NOM_OWNER || "Luka",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255612619717",              
    
    // Status Features
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',              
    
    // Bot Information
    BOT: process.env.BOT_NAME || '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
    BOT_NAME: process.env.BOT_NAME || '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
    URL: process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8a9abd.png',
    
    // Mode Settings
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    
    // Heroku Settings
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY,
    
    // Warning System
    WARN_COUNT: process.env.WARN_COUNT || '3',
    
    // Presence Settings
    ETAT: process.env.PRESENCE || '1',
    PRESENCE: process.env.PRESENCE || '1',
    
    // Chatbot
    CHATBOT: process.env.PM_CHATBOT || 'no',
    
    // Display Settings
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    
    // ANTI-DELETE FEATURE - IMPORTANT FOR YOUR INDEX
    ADM: process.env.ANTI_DELETE_MESSAGE || process.env.ADM || 'yes',
    ANTI_DELETE_MESSAGE: process.env.ANTI_DELETE_MESSAGE || process.env.ADM || 'yes',
    ANTIDELETE1: process.env.ANTIDELETE1 || 'yes',
    ANTIDELETE2: process.env.ANTIDELETE2 || 'yes',
    
    // Database
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" 
        : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`🔄 mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});