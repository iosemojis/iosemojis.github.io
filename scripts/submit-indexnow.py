#!/usr/bin/env python3
"""
IndexNow URL Submission Script for iosemojis.github.io
Submits all URLs from sitemap.xml to Bing and IndexNow search engines.
"""

import os
import sys
import json
import urllib.request
import xml.etree.ElementTree as ET

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITEMAP_PATH = os.path.join(ROOT_DIR, "sitemap.xml")
KEY = "ba1bef65d3ce4648ac0305e081bd8be4"
HOST = "iosemojis.github.io"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def submit_indexnow():
    if not os.path.exists(SITEMAP_PATH):
        print(f"Error: {SITEMAP_PATH} not found.")
        sys.exit(1)

    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    urls = [elem.text for elem in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    print(f"Found {len(urls)} URLs in sitemap.xml to submit to IndexNow & Bing...")

    batch = urls[:10000]
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": batch
    }

    data = json.dumps(payload).encode("utf-8")
    endpoints = [
        ("Bing IndexNow", "https://www.bing.com/indexnow"),
        ("Central IndexNow", "https://api.indexnow.org/indexnow"),
        ("Yandex IndexNow", "https://yandex.com/indexnow")
    ]

    for name, endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
        try:
            with urllib.request.urlopen(req) as response:
                code = response.getcode()
                print(f"[{name}] Status: {code} - Successfully queued {len(batch)} URLs for rapid indexing!")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            print(f"[{name}] HTTP Error {e.code}: {body}")
        except Exception as e:
            print(f"[{name}] Error: {e}")

if __name__ == "__main__":
    submit_indexnow()
