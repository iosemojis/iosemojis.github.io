#!/usr/bin/env python3
"""
Generates clean production sitemap.xml with ONLY the 8 core multilingual keyboard pages.
Matches the winning schema of emojikeyboard.top (100% accepted by Google Search Console).
"""

import os
import sys
from datetime import datetime, timezone

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
DIST_DIR = os.path.join(ROOT_DIR, "dist")
BASE_URL = "https://iosemojis.github.io"

LANGUAGES = [
    {"code": "en", "path": "/", "priority": "1.00"},
    {"code": "es", "path": "/es/", "priority": "0.90"},
    {"code": "pt", "path": "/pt/", "priority": "0.90"},
    {"code": "de", "path": "/de/", "priority": "0.90"},
    {"code": "fr", "path": "/fr/", "priority": "0.90"},
    {"code": "it", "path": "/it/", "priority": "0.90"},
    {"code": "id", "path": "/id/", "priority": "0.90"},
    {"code": "ja", "path": "/ja/", "priority": "0.90"},
]

def generate_sitemap():
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")

    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset',
        '      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
        '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
    ]

    for lang in LANGUAGES:
        loc = f"{BASE_URL}{lang['path']}"
        sitemap_lines.append("<url>")
        sitemap_lines.append(f"  <loc>{loc}</loc>")
        sitemap_lines.append(f"  <lastmod>{now_iso}</lastmod>")
        sitemap_lines.append(f"  <priority>{lang['priority']}</priority>")
        sitemap_lines.append("</url>")

    sitemap_lines.append("</urlset>\n")
    sitemap_content = "\n".join(sitemap_lines)

    # Write to root, public, and dist
    target_locations = [
        os.path.join(ROOT_DIR, "sitemap.xml"),
        os.path.join(PUBLIC_DIR, "sitemap.xml"),
        os.path.join(DIST_DIR, "sitemap.xml") if os.path.exists(DIST_DIR) else None,
    ]

    for path in target_locations:
        if path:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                f.write(sitemap_content)
            print(f"✅ Generated clean 8-URL sitemap.xml at: {path}")

    # Write clean robots.txt
    robots_content = f"""User-agent: *
Allow: /

# Sitemap
Sitemap: {BASE_URL}/sitemap.xml
"""
    robots_locations = [
        os.path.join(ROOT_DIR, "robots.txt"),
        os.path.join(PUBLIC_DIR, "robots.txt"),
        os.path.join(DIST_DIR, "robots.txt") if os.path.exists(DIST_DIR) else None,
    ]
    for path in robots_locations:
        if path:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                f.write(robots_content)
            print(f"✅ Generated robots.txt at: {path}")

if __name__ == "__main__":
    generate_sitemap()
