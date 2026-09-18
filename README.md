# WhatsApp Click Tracker

## Ce que ça fait
- Quand quelqu'un clique sur le lien, le serveur enregistre : User-Agent, IP, referer, et une estimation (WhatsApp app / WhatsApp Web / autre).
- Toi seule peux voir les résultats via `/stats?pw=TON_MOT_DE_PASSE`.
- La personne qui clique ne voit qu'un message anodin ("chargement...").

## ⚠️ Important sur la fiabilité
- **Android** : détectable de façon assez fiable (le navigateur intégré WhatsApp laisse une trace "wv" dans le User-Agent).
- **iOS** : PAS fiable. Le navigateur intégré de WhatsApp sur iPhone ressemble presque exactement à Safari normal — impossible de les distinguer avec certitude via cette méthode.
- **WhatsApp Web** (sur ordinateur) : facile à distinguer car c'est un vrai navigateur desktop.

## Déploiement (gratuit, 5 minutes) — Render.com
1. Crée un compte sur https://render.com
2. Clique "New +" → "Web Service"
3. Choisis "Deploy from a public Git repo" OU upload ce dossier via leur interface / GitHub
4. Build command : `npm install`
5. Start command : `npm start`
6. Dans "Environment", ajoute une variable : `ADMIN_PASSWORD` = ton mot de passe secret
7. Une fois déployé, tu obtiens une URL du type `https://ton-app.onrender.com`

## Utilisation
- Lien à mettre dans le message WhatsApp : `https://ton-app.onrender.com`
- Pour voir les résultats : `https://ton-app.onrender.com/stats?pw=ton-mot-de-passe`

## Alternative sans code
Si tu veux éviter le déploiement, un raccourcisseur comme Rebrandly ou Bitly donne aussi un rapport de clics (OS, navigateur, heure) sans avoir besoin d'héberger quoi que ce soit — mais avec les mêmes limites de fiabilité sur iOS.
