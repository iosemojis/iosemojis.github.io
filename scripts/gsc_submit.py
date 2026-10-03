import os
import sys
import time
import json

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Path to the service account JSON key on Desktop
DEFAULT_KEY_FILE = os.path.expanduser(r"~\Desktop\legalpages-indexer-9c6590962075.json")
SCOPES = ["https://www.googleapis.com/auth/indexing"]

BASE_URL = "https://iosemojis.github.io"

# High-priority, high-volume target pages for Google
IMPORTANT_PAGES = [
    # Core & Category Hubs
    f"{BASE_URL}/",
    f"{BASE_URL}/category/aesthetic-emojis/",
    f"{BASE_URL}/category/gaming-streaming/",
    f"{BASE_URL}/category/music-audio/",
    f"{BASE_URL}/category/fashion-beauty/",
    f"{BASE_URL}/category/money-crypto/",
    f"{BASE_URL}/category/horror-spooky/",
    f"{BASE_URL}/category/cute-kawaii/",
    f"{BASE_URL}/category/gym-fitness/",
    f"{BASE_URL}/category/smileys-emotions/",
    f"{BASE_URL}/category/hearts-love/",
    f"{BASE_URL}/category/viral-emojis/",
    f"{BASE_URL}/category/festivals-holidays/",
    # Top Ahrefs High-Volume Everyday Search Emojis
    f"{BASE_URL}/emoji/face-with-tears-of-joy/",           # Laughing emoji (1M+)
    f"{BASE_URL}/emoji/loudly-crying-face/",              # Crying emoji (500K+)
    f"{BASE_URL}/emoji/red-heart/",                       # Heart emoji (500K+)
    f"{BASE_URL}/emoji/thumbs-up/",                       # Thumbs up emoji (300K+)
    f"{BASE_URL}/emoji/skull/",                           # Skull emoji (300K+)
    f"{BASE_URL}/emoji/fire/",                            # Fire emoji (300K+)
    f"{BASE_URL}/emoji/eyes/",                            # Side eye emoji (200K+)
    f"{BASE_URL}/emoji/nerd-face/",                       # Nerd emoji (200K+)
    f"{BASE_URL}/emoji/person-shrugging/",                # Shrug emoji (150K+)
    f"{BASE_URL}/emoji/heart-on-fire/",                   # Heart on fire (100K+)
    f"{BASE_URL}/emoji/melting-face/",                    # Melting face (100K+)
    f"{BASE_URL}/emoji/pleading-face/",                   # Pleading / puppy eyes (100K+)
    f"{BASE_URL}/emoji/sparkles/",                        # Sparkles emoji (100K+)
    f"{BASE_URL}/emoji/folded-hands/",                    # Folded hands / pray (100K+)
    f"{BASE_URL}/emoji/smiling-face-with-heart-eyes/",    # Heart eyes (100K+)
    f"{BASE_URL}/emoji/rolling-on-the-floor-laughing/",   # ROFL (100K+)
    f"{BASE_URL}/emoji/smiling-face-with-sunglasses/",    # Cool / sunglasses (80K+)
    f"{BASE_URL}/emoji/middle-finger/",                   # Middle finger (80K+)
    f"{BASE_URL}/emoji/clown-face/",                      # Clown emoji (80K+)
    f"{BASE_URL}/emoji/thinking-face/",                   # Thinking emoji (70K+)
    f"{BASE_URL}/emoji/face-holding-back-tears/",         # Holding back tears (60K+)
    f"{BASE_URL}/emoji/blue-heart/",                      # Blue heart (50K+)
    f"{BASE_URL}/emoji/purple-heart/",                    # Purple heart (50K+)
    f"{BASE_URL}/emoji/white-heart/",                     # White heart (50K+)
    f"{BASE_URL}/emoji/black-heart/",                     # Black heart (50K+)
    # Guides & Hubs
    f"{BASE_URL}/guides/iphone-emoji/",
    f"{BASE_URL}/guides/heart-emoji-meanings/",
    f"{BASE_URL}/guides/religious-emojis/",
]

def submit_urls(key_file=DEFAULT_KEY_FILE, urls=IMPORTANT_PAGES):
    if not os.path.exists(key_file):
        print(f"[ERROR] Service account file not found: {key_file}")
        return

    with open(key_file, "r") as f:
        acc_data = json.load(f)
    client_email = acc_data.get("client_email", "Unknown")

    print("=" * 65)
    print("🚀 Google Indexing API Submission via Python")
    print(f"🔑 Service Account: {client_email}")
    print(f"📄 Pages to submit: {len(urls)}")
    print("=" * 65)

    try:
        credentials = service_account.Credentials.from_service_account_file(key_file, scopes=SCOPES)
        service = build("indexing", "v3", credentials=credentials)
    except Exception as e:
        print(f"[ERROR] Failed to initialize Google API client: {e}")
        return

    success_count = 0
    forbidden = False

    for i, url in enumerate(urls, 1):
        body = {
            "url": url,
            "type": "URL_UPDATED"
        }
        try:
            response = service.urlNotifications().publish(body=body).execute()
            notify_time = response.get("urlNotificationMetadata", {}).get("latestUpdate", {}).get("notifyTime", "Just now")
            print(f"[{i}/{len(urls)}] ✅ Submitted: {url} -> Time: {notify_time}")
            success_count += 1
            time.sleep(0.5)  # Respect rate limits
        except HttpError as err:
            if err.resp.status == 403:
                print(f"[{i}/{len(urls)}] ❌ 403 Permission Denied for {url}")
                forbidden = True
                break
            elif err.resp.status == 429:
                print(f"[{i}/{len(urls)}] ⚠️ 429 Rate limited. Waiting 10s...")
                time.sleep(10)
            else:
                print(f"[{i}/{len(urls)}] ❌ Error {err.resp.status}: {err}")
        except Exception as ex:
            print(f"[{i}/{len(urls)}] ❌ Unexpected error: {ex}")

    print("=" * 65)
    if forbidden:
        print("\n⚠️ ACTION REQUIRED IN GOOGLE SEARCH CONSOLE:")
        print(f"1. Go to Google Search Console: https://search.google.com/search-console")
        print(f"2. Select your property: {BASE_URL}/")
        print(f"3. Click 'Settings' (bottom-left) -> 'Users and permissions'")
        print(f"4. Click 'Add User'")
        print(f"5. Enter Email: {client_email}")
        print(f"6. Select Permission: 'Owner' (required by Google Indexing API)")
        print(f"7. Click 'Add' and run this script again!\n")
    else:
        print(f"🎉 Successfully submitted {success_count}/{len(urls)} pages to Google Indexing Queue!")
    print("=" * 65)

if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_KEY_FILE
    submit_urls(key_file=key)
