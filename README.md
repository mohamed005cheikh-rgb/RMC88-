
# 🖥️ rmc88 - Remote Control System | نظام التحكم عن بعد

**نظام تحكم عن بعد احترافي وخفيف** يعتمد على شبكة محلية (Local Network / Hotspot) للتحكم بالفأرة ولوحة المفاتيح عبر هاتفك الذكي دون الحاجة للإنترنت.
**Un système de contrôle à distance léger et professionnel** utilisant un réseau local (Wi-Fi / Hotspot) pour contrôler la souris et le clavier depuis votre smartphone, sans connexion Internet.

---

## 📋 متطلبات التشغيل | Prérequis
1. جهاز حاسوب يعمل بنظام **Windows** | Un ordinateur sous **Windows**
2. هاتف ذكي (Android / iPhone) | Un smartphone (Android / iPhone)
3. شبكة واي فاي مشتركة أو نقطة اتصال (`Hotspot`) يفتحها الهاتف ويتصل بها الحاسوب | Un réseau Wi-Fi partagé ou un point d'accès (`Hotspot`) créé par le téléphone et connecté à l'ordinateur

---

## 🚀 الخطوات الكاملة للتشغيل | Guide d'installation complet

### 🔹 الخطوة 1: تثبيت لغة بايثون والمكتبات | Étape 1 : Installer Python et les bibliothèques
1. تأكد من تثبيت Python على حاسوبك | Assurez-vous que Python est installé sur votre ordinateur
2. افتح موجه الأوامر (`CMD` أو `Terminal`) ونفّذ الأمر التالي | Ouvrez l'invite de commandes (`CMD` ou `Terminal`) et exécutez :
   ```bash
   pip install flask flask-cors pyautogui
```

---

🔹 الخطوة 2: إنشاء ملف الاختصار (Shortcut) لتشغيل السيرفر بنقرة واحدة | Étape 2 : Créer un raccourci pour lancer le serveur en un clic

لكي لا تضطر لفتح برنامج VS Code أو كتابة الأوامر في كل مرة، اتبع هذه الخطوات البسيطة على جهاز الكمبيوتر (Windows) :
Pour éviter d'ouvrir VS Code ou de taper des commandes à chaque fois, suivez ces étapes simples sur votre ordinateur (Windows) :

1. افتح المجلد الذي يوجد فيه ملف server.py | Ouvrez le dossier contenant server.py
2. انقر بزر الفأرة الأيمن في مكان فارغ داخل المجلد، ثم اختر New ثم Text Document | Cliquez avec le bouton droit dans un espace vide du dossier, puis choisissez Nouveau → Document texte
3. افتح هذا الملف النصي الجديد واكتب بداخله الكود التالي | Ouvrez ce nouveau fichier texte et écrivez le code suivant :
   ```batch
   @echo off
   title rmc88 Server
   python server.py
   pause
   ```
4. اضغط على File ثم Save As | Cliquez sur Fichier → Enregistrer sous
5. سمّ الملف بالاسم التالي بالحرف: run.bat (وتأكد من أن خيار Save as type مضبوط على All Files وليس Text Document)، ثم اضغط Save | Nommez le fichier run.bat (assurez-vous que le type est Tous les fichiers et non Document texte), puis Enregistrer

✨ الآن، كل ما عليك فعله لتشغيل السيرفر في أي وقت هو النقر المزدوج (Double Click) على ملف run.bat وسيعمل السيرفر فوراً في نافذة سوداء دون الحاجة لـ VS Code !
✨ Maintenant, il vous suffit de double-cliquer sur run.bat pour lancer le serveur instantanément dans une fenêtre noire, sans avoir besoin de VS Code !

---

🔹 الخطوة 3: تجهيز وتشغيل السيرفر | Étape 3 : Préparer et lancer le serveur

· ضع ملف server.py وملف الاختصار run.bat في مجلد واحد على حاسوبك | Placez server.py et run.bat dans le même dossier
· انقر نقراً مزدوجاً على run.bat لفتح السيرفر (سيظهر لك عنوان الـ IP المحلي ورقم المنفذ 5555) | Double-cliquez sur run.bat pour lancer le serveur (l'adresse IP locale et le port 5555 s'afficheront)
· ⚠️ ملاحظة هامة : عند أول تشغيل، قد يظهر تحذير من جدار حماية ويندوز (Windows Firewall)، اضغط على السماح بالوصول (Allow Access) | ⚠️ Remarque importante : Lors de la première exécution, Windows Firewall peut afficher un avertissement, cliquez sur Autoriser l'accès (Allow Access)

---

🔹 الخطوة 4: تشغيل واجهة التحكم على الهاتف | Étape 4 : Lancer l'interface sur le téléphone

· افتح واجهة التحكم عبر متصفح هاتفك (من ملف index.html المخزن محلياً أو الرابط الخاص بك) | Ouvrez l'interface via le navigateur de votre téléphone (depuis index.html ou votre lien)
· انقر على أيقونة الإعدادات (⚙️)، اكتب عنوان الـ IP الخاص بالحاسوب، وتأكد أن المنفذ (Port) مضبوط على 5555 | Cliquez sur l'icône des paramètres (⚙️), entrez l'IP de l'ordinateur, vérifiez que le port est 5555
· اضغط على Connect. عندما يتحول مؤشر الحالة إلى الأخضر Connected، يكون النظام جاهزاً للاستخدام الفوري ! | Appuyez sur Connect. Lorsque le statut passe au vert Connected, le système est prêt !

---

🛠️ دليل حل المشاكل الشائعة | Guide de dépannage

🔴 المشكلة 1: حالة الاتصال تظل "Disconnected" ولا يستجيب النظام | Problème 1 : Le statut reste "Disconnected" et rien ne répond

السبب | Cause :

· الحاسوب والهاتف غير متصلين على نفس الشبكة | L'ordinateur et le téléphone ne sont pas sur le même réseau
· أو أن ملف server.py مغلق | Ou le fichier server.py est fermé

الحل | Solution :

· تأكد من تشغيل ملف السيرفر | Vérifiez que le serveur est en cours d'exécution
· تأكد من اتصال الجهازين بنفس شبكة الـ Hotspot أو الواي فاي | Vérifiez que les deux appareils sont connectés au même réseau Hotspot ou Wi-Fi

---

🔴 المشكلة 2: ظهور خطأ في الـ Terminal عند تشغيل السيرفر | Problème 2 : Erreur dans le Terminal au lancement du serveur

السبب | Cause :

· لم يتم تثبيت المكتبات المطلوبة بشكل صحيح | Les bibliothèques requises ne sont pas installées correctement

الحل | Solution :

· تأكد من تنفيذ أمر الـ pip install المذكور في الخطوة الأولى | Assurez-vous d'exécuter la commande pip install mentionnée à l'étape 1

---

🔴 المشكلة 3: المتصفح يرفض الاتصال تماماً | Problème 3 : Le navigateur refuse complètement la connexion

السبب | Cause :

· نسيان كتابة المنفذ :5555 | Oubli du port :5555
· أو حظر أمني من متصفح الهاتف (مثل Brave Shields) | Ou blocage de sécurité par le navigateur du téléphone (comme Brave Shields)

الحل | Solution :

· أوقف حماية المتصفح المؤقتة | Désactivez temporairement la protection du navigateur
· أو تأكد من صحة كتابة الـ IP والمنفذ | Ou vérifiez l'exactitude de l'adresse IP et du port

---

📄 حقوق النشر | Copyright

Copyright © 2026
📧 mohamed005cheikh@gmail.com
Designed and developed by mc88 | Conçu et développé par mc88
All rights reserved | Tous droits réservés

```

---

هذا هو الملف الكامل، انسخه من هنا مباشرة وضعه في ملف README.md
