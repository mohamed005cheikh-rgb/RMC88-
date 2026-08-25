
# RMC88 Remote

RMC88 Remote est une application web légère, ultra-rapide et fonctionnant à 99% hors ligne, qui transforme votre smartphone en pavé tactile sans fil, en clavier et en contrôleur système pour votre PC Windows.

---

## 🚀 Guide d'installation étape par étape (Pour débutants)

Si vous n'avez jamais installé Python ou d'outils de développement auparavant, ne vous inquiétez pas ! Suivez simplement ces étapes simples :

### Étape 1 : Installer Python
1. Rendez-vous sur le site officiel de Python : [python.org/downloads](https://www.python.org/downloads/)
2. Téléchargez la dernière version de Python pour Windows (par exemple, Python 3.x).
3. **TRÈS IMPORTANT :** Pendant l'installation, assurez-vous de cocher la case en bas qui indique **"Add Python to PATH"** avant de cliquer sur "Install Now".
4. Une fois l'installation terminée, vous pouvez vérifier en ouvrant l'Invite de commandes (`cmd`) et en tapant `python --version`.

### Étape 2 : Télécharger les fichiers du projet
Assurez-vous d'avoir les deux fichiers suivants dans le **même dossier** sur votre ordinateur :
1. `index.html` (L'interface web mobile)
2. `server.py` (Le serveur backend Python)

### Étape 3 : Installer les bibliothèques requises
Ouvrez votre Invite de commandes (`cmd`) ou PowerShell, accédez au dossier où vos fichiers sont enregistrés, et exécutez la commande suivante pour installer les bibliothèques nécessaires :

```bash
pip install flask flask-cors pyautogui qrcode
```
Remarque : Une connexion Internet n'est nécessaire que pour cette seule commande afin de télécharger les bibliothèques.
Étape 4 : Lancer le serveur
 * Double-cliquez sur server.py, ou lancez-le depuis votre terminal :

   ```
   python server.py
 * Une fenêtre noire apparaîtra affichant un lien réseau local (par exemple, http://192.168.x.x:5555) et un code QR.
Étape 5 : Connecter votre téléphone
 * Activez le point d'accès mobile (Hotspot) sur votre PC, ou connectez votre PC et votre téléphone au même réseau Wi-Fi.
 * Scannez le code QR affiché dans votre terminal à l'aide de l'appareil photo de votre téléphone, ou tapez directement l'URL dans le navigateur de votre téléphone.
 * Profitez de votre télécommande ultra-fluide et fonctionnant hors ligne à 99% !
🛠️ Prérequis et Dépendances
 * Python 3.x
 * Bibliothèques :
   * Flask (Framework de serveur web)
   * Flask-CORS (Partage de ressources entre origines)
   * PyAutoGUI (Automatisation de la souris et du clavier)
   * qrcode (Génération de code QR dans le terminal)
📄 Copyright et Support
 * Copyright : © 2026
 * Développeur : Mohamed005cheikh@gmail.com | par MC88
 * WhatsApp : 30726475

<div align="center">
  <br>
  <img src="WM.png" alt="MC88 Watermark" width="100px">
  <br>
</div>
