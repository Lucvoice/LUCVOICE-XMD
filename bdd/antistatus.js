require("dotenv").config();
const { Pool } = require("pg");
let s = require("../set");
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

// Function to create antistatus table
async function createAntiStatusTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antistatus (
        jid text PRIMARY KEY,
        etat text DEFAULT 'non',
        action text DEFAULT 'delete'
      );
    `);
    console.log("✅ Anti-status table created successfully.");
  } catch (error) {
    console.error("❌ Error creating anti-status table:", error);
  } finally {
    client.release();
  }
}

createAntiStatusTable();

// Add or update JID status
async function ajouterOuMettreAJourStatusJid(jid, etat) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM antistatus WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antistatus SET etat = $1 WHERE jid = $2', [etat, jid]);
    } else {
      await client.query('INSERT INTO antistatus (jid, etat, action) VALUES ($1, $2, $3)', [jid, etat, 'delete']);
    }
    console.log(`✅ Anti-status JID ${jid} updated.`);
  } catch (error) {
    console.error('❌ Error updating anti-status JID:', error);
  } finally {
    client.release();
  }
}

// Update action for JID
async function mettreAJourStatusAction(jid, action) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM antistatus WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      await client.query('UPDATE antistatus SET action = $1 WHERE jid = $2', [action, jid]);
    } else {
      await client.query('INSERT INTO antistatus (jid, etat, action) VALUES ($1, $2, $3)', [jid, 'non', action]);
    }
    console.log(`✅ Anti-status action updated for ${jid}`);
  } catch (error) {
    console.error('❌ Error updating anti-status action:', error);
  } finally {
    client.release();
  }
}

// Check if anti-status is enabled for JID
async function verifierStatusEtatJid(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT etat FROM antistatus WHERE jid = $1', [jid]);
    if (result.rows.length > 0) {
      return result.rows[0].etat === 'oui';
    }
    return false;
  } catch (error) {
    console.error('❌ Error checking anti-status state:', error);
    return false;
  } finally {
    client.release();
  }
}

// Get action for JID
async function recupererStatusActionJid(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT action FROM antistatus WHERE jid = $1', [jid]);
    if (result.rows.length > 0) {
      return result.rows[0].action;
    }
    return 'delete'; // default action
  } catch (error) {
    console.error('❌ Error getting anti-status action:', error);
    return 'delete';
  } finally {
    client.release();
  }
}

module.exports = {
  ajouterOuMettreAJourStatusJid,
  mettreAJourStatusAction,
  verifierStatusEtatJid,
  recupererStatusActionJid
};
