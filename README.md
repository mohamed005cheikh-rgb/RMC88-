# RMC88 Remote

Turn your phone's browser into a wireless trackpad, keyboard, media
remote, and power switch for your **Windows PC** — 100% over your own
Wi‑Fi, no cloud, no account, no internet required once it's set up.

**Copyright © 2026 mohamed005cheikh@gmail.com — Developed by MC88**

---

## ⚠️ Windows only

This project only works on **Windows 10 / 11**. It uses Windows-only
APIs (`ctypes.windll`, `shutdown`, `LockWorkStation`, `powrprof.dll`)
to move the mouse and control power. It will refuse to start on
macOS or Linux.

---

## What you need (libraries / prerequisites)

| Requirement | Why |
|---|---|
| **Windows 10/11 PC** | The server only runs on Windows |
| **Python 3.9+** | Runs the server (`rmc88.py`). Get it from [python.org](https://python.org) — during install, check **"Add Python to PATH"** |
| **A phone (or any device) with a browser** | This is the remote — no app install needed |
| **Same Wi‑Fi network** | Your PC and phone must be on the same local network (this is what keeps everything offline / private) |

Python packages (installed automatically for you, or manually via `pip install -r requirements.txt`):

- `Flask` — the tiny local web server
- `flask-cors` — lets the phone's browser talk to the server
- `pyautogui` — simulates mouse/keyboard on Windows
- `qrcode` — optional, prints a scannable QR code in the console so you don't have to type the IP address

Nothing is sent anywhere outside your home network. There is no
internet connection required after installation — the only reason
you'd ever need internet is to `pip install` the packages the first
time.

---

## 📦 Folder contents

```
RMC88/
 ├─ rmc88.py            # the server — run this ON YOUR PC
 ├─ index.html           # the remote control page — served to your phone automatically
 ├─ requirements.txt      # Python dependencies
 ├─ Start_RMC88.bat       # double-click launcher (sets everything up for you)
 └─ README.md             # this file
```

Keep `rmc88.py` and `index.html` in the **same folder** — the server
reads `index.html` from its own directory.

---

## 🚀 Getting started (easiest way)

1. Copy the whole `RMC88` folder onto your Windows PC.
2. Double‑click **`Start_RMC88.bat`**.
   - The first run will create a private Python environment and
     install the required packages automatically (needs internet
     just this once).
   - Every run after that starts instantly.
3. A console window opens and shows something like:

   ```
   +------------------------------------------------------+
   |              RMC88 REMOTE - SERVER READY              |
   +------------------------------------------------------+
   | Open this link on your phone (same Wi-Fi):            |
   | http://192.168.1.23:5555                              |
   +------------------------------------------------------+
   | Your PIN (enter once on the phone): 4821               |
   +------------------------------------------------------+

   === SCAN TO CONNECT ===
   [QR CODE]
   =======================
   ```

4. On your phone (connected to the **same Wi‑Fi**), either:
   - scan the QR code, or
   - open the link shown (e.g. `http://192.168.1.23:5555`) in any browser.
5. Type in the **4‑digit PIN** shown in the console. Your phone
   remembers it after that, so you won't need to re‑type it unless
   you restart the server (a new PIN is generated every launch, for
   security — see below).

### Manual setup (without the .bat file)

```bash
pip install -r requirements.txt
python rmc88.py
```

---

## 🔐 Why the PIN?

Anyone connected to your Wi‑Fi could otherwise open the same link
and control your PC. To prevent that, a new random 4‑digit PIN is
generated **every time you start the server**, shown only on your
PC's own screen. Your phone has to enter it once per server
session. If you restart the server, you'll need the new PIN again.

---

## 🖱️ Using the remote

The app has four tabs at the top: **Touch · Keys · Media · Power**.

### Touch tab
- **Main pad, 1 finger** — move the mouse. Movement uses an
  acceleration curve (small slow movements = precise, fast flicks =
  travel further), similar to a real laptop trackpad — not flat 1:1
  tracking.
- **Tap once** — left click. **Double‑tap** — double click.
- **Press and hold ~¼ second, then drag** — click‑and‑drag (for
  selecting text, dragging files, moving windows). Lift your finger
  to release.
- **2 fingers, move up/down** — scroll. **2‑finger tap** — right
  click. **3‑finger tap** — middle click.
- **Narrow strip on the right edge** — a dedicated scroll zone, just
  like the edge‑scroll zone on a real laptop trackpad. Slide your
  finger up/down there to scroll without moving the cursor.
- **Speed slider** — adjust overall pointer sensitivity; it's saved
  on your phone for next time.
- **Arrow keys & paging** — on‑screen ▲▼◀▶, Page Up/Down, Home/End
  buttons for precise navigation (scrolling documents, web pages,
  games) without touching the pad at all.

### Keys tab
- A text box that types on the PC as you type on your phone
  (including autocorrect‑free, so what you type is exactly what
  arrives).
- Quick keys: Esc, Enter, Backspace, Space, Tab, Delete, F5, F11.
- Shortcuts: Copy / Paste / Cut / Undo / Redo / Select All / Save /
  Find / Alt+Tab / Close window / Show Desktop / Explorer / Task
  View / Snip & Sketch / Task Manager / Print Screen.

> **Note:** Windows blocks any software (this one included) from
> simulating `Ctrl+Alt+Delete` — that's an intentional Windows
> security feature, not a bug here. Use **Ctrl+Shift+Esc** (Task
> Manager) instead, which is included above.

### Media tab
Previous / Play‑Pause / Next, and Volume Down / Mute / Up — these
work with whatever app currently has media focus (Spotify, YouTube,
VLC, etc.), same as the media keys on a real keyboard.

### Power tab
- **Lock** — locks the PC instantly (like `Win+L`, but uses the
  reliable `LockWorkStation` call).
- **Sleep** — puts the PC to sleep.
- **Restart / Shutdown** — asks for confirmation first, then gives
  Windows a 1‑second grace period.
- **Cancel pending shutdown** — stops a shutdown/restart that's
  already been triggered (useful if you tap the wrong button).

---

## 🛠️ Troubleshooting

**Phone can't reach the page / "This site can't be reached"**
- Confirm the phone and PC are on the *same* Wi‑Fi network (not one
  on 5GHz guest and one on the main network, etc.).
- Windows Firewall may be blocking it the first time — when you run
  `Start_RMC88.bat`, allow access when Windows asks about Python /
  Flask ("Private networks" is enough, you don't need "Public").
- Double‑check the IP address printed in the console hasn't changed
  (it can change if you reconnect to Wi‑Fi) — always use the one
  currently shown.

**"Wrong PIN" even though you typed it correctly**
- The PIN changes every time the server restarts. Make sure you're
  reading the PIN from the *current* console window.

**Mouse doesn't move / clicks don't work**
- Some games and elevated (Run as Administrator) windows block
  simulated input from a non‑elevated process. Try running
  `Start_RMC88.bat` as Administrator (right‑click → Run as
  administrator) if this happens.

**Python not found**
- Reinstall Python from python.org and make sure **"Add Python to
  PATH"** is checked during setup, then re‑run `Start_RMC88.bat`.

---

## 🔒 Privacy

- No data leaves your local network. There is no analytics, no
  cloud server, no account.
- The PIN and server code never send anything to the internet.
- Source is fully readable in `rmc88.py` and `index.html` — nothing
  is hidden or obfuscated.

---

## License / Credits

© 2026 mohamed005cheikh@gmail.com — Developed by MC88.
Free to use and modify for personal use.

<div align="center">
  <br>
  <img src="WM.png" alt="MC88 Watermark" width="100px">
  <br>
</div>
