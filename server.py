# rmc88.py
# RMC88 Remote - Offline Server Engine
# Copyright (c) 2026 mohamed005cheikh@gmail.com | by MC88

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pyautogui
import threading
import socket
import ctypes
import os

# PyAutoGUI performance optimizations
pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0

app = Flask(__name__)
CORS(app)
command_lock = threading.Lock()

def get_local_ip():
    """Retrieve machine local IP address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("10.255.255.255", 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def print_qr(url):
    """Generate QR code in terminal if library is present."""
    try:
        import qrcode
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=1, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        print("\n=== SCAN TO CONNECT ===")
        qr.print_ascii(invert=True)
        print("=======================\n")
    except ImportError:
        pass

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "active"}), 200

@app.route('/command', methods=['POST'])
def handle_command():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON"}), 400

    action = data.get('action')

    try:
        with command_lock:
            if action == 'mouse_move':
                dx = int(data.get('dx', 0))
                dy = int(data.get('dy', 0))
                if dx != 0 or dy != 0:
                    ctypes.windll.user32.mouse_event(0x0001, dx, dy, 0, 0)

            elif action == 'mouse_click':
                pyautogui.click(button=data.get('button', 'left'))

            elif action == 'scroll':
                amount = int(data.get('amount', 0))
                if amount != 0:
                    pyautogui.scroll(amount)

            elif action == 'type_text':
                text = data.get('text', '')
                if text:
                    pyautogui.write(text, interval=0.001)

            elif action == 'key_press':
                key = data.get('key')
                if key:
                    pyautogui.press(key)

            elif action == 'hotkey':
                keys = data.get('keys', [])
                if keys:
                    pyautogui.hotkey(*keys)

            elif action == 'shutdown':
                os.system("shutdown /s /t 1")

            elif action == 'restart':
                os.system("shutdown /r /t 1")

            else:
                return jsonify({"success": False, "error": "Unknown action"}), 400

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    server_ip = get_local_ip()
    port = 5555
    url = f"http://{server_ip}:{port}"

    print("\n" + "+" + "-" * 54 + "+")
    print("|" + "RMC88 REMOTE - SERVER READY".center(54) + "|")
    print("+" + "-" * 54 + "+")
    print(f"| Open this link on your phone:                       |")
    print(f"| {url:<52} |")
    print("+" + "-" * 54 + "+")

    print_qr(url)

    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)

    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
