const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'clicks.json');
// Change ce mot de passe avant de déployer !
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-moi';

function readLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// Devine la source du clic à partir du User-Agent
function guessSource(userAgent) {
  const ua = (userAgent || '').toLowerCase();

  // Android : le navigateur intégré de WhatsApp ajoute souvent "wv" (WebView)
  if (ua.includes('wv') && ua.includes('android')) {
    return 'WhatsApp application (Android) — probable';
  }
  // WhatsApp Web tourne dans un vrai navigateur de bureau (Chrome/Edge/Firefox classique)
  if (ua.includes('windows') || (ua.includes('macintosh') && !ua.includes('mobile'))) {
    return 'WhatsApp Web (ordinateur) — probable';
  }
  // iOS : le navigateur intégré de WhatsApp ressemble beaucoup à Safari mobile normal.
  // Impossible à distinguer avec certitude uniquement via le User-Agent.
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS (app ou Safari) — indistinguable de façon fiable';
  }
  if (ua.includes('android')) {
    return 'Android — navigateur classique probable (pas WhatsApp in-app)';
  }
  return 'Source inconnue';
}

app.get('/', (req, res) => {
  const entry = {
    date: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    referer: req.headers['referer'] || null,
    guess: guessSource(req.headers['user-agent']),
  };

  const logs = readLogs();
  logs.push(entry);
  saveLogs(logs);

  // Page vue par la personne qui clique : anodine, ne montre rien de spécial
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><title>Chargement...</title></head>
    <body style="font-family: sans-serif; padding: 40px; text-align: center;">
      <p>Chargement du contenu...</p>
      <script>
        setTimeout(() => {
          document.body.innerHTML = "<p>Impossible de charger la suite du message pour le moment.</p>";
        }, 800);
      </script>
    </body>
    </html>
  `);
});

// Page privée pour toi : /stats?pw=TON_MOT_DE_PASSE
app.get('/stats', (req, res) => {
  if (req.query.pw !== ADMIN_PASSWORD) {
    return res.status(403).send('Accès refusé.');
  }
  const logs = readLogs().reverse();
  const rows = logs.map(l => `
    <tr>
      <td>${l.date}</td>
      <td>${l.guess}</td>
      <td style="max-width:300px; word-break:break-all;">${l.userAgent}</td>
      <td>${l.ip}</td>
    </tr>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><title>Stats des clics</title></head>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>Historique des clics</h2>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width:100%;">
        <tr><th>Date</th><th>Estimation</th><th>User-Agent</th><th>IP</th></tr>
        ${rows || '<tr><td colspan="4">Aucun clic pour le moment.</td></tr>'}
      </table>
    </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
