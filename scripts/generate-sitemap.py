#!/usr/bin/env python3
"""
Generates production sitemap.xml and robots.txt
Includes homepage, all category pages, all programmatic emoji pages, guides, and trust pages.
"""

import os
import sys
import json
from datetime import datetime

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://iosemojis.github.io"

def generate_sitemap():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    today = datetime.now().strftime("%Y-%m-%d")

    # Load data
    with open(os.path.join(DATA_DIR, "emojis.json"), "r", encoding="utf-8") as f:
        emojis = json.load(f)
    with open(os.path.join(DATA_DIR, "categories.json"), "r", encoding="utf-8") as f:
        categories = json.load(f)
    with open(os.path.join(DATA_DIR, "guides.json"), "r", encoding="utf-8") as f:
        guides = json.load(f)
    festivals = []
    festivals_path = os.path.join(DATA_DIR, "festivals.json")
    if os.path.exists(festivals_path):
        with open(festivals_path, "r", encoding="utf-8") as f:
            festivals = json.load(f)

    urls = []

    # 1. Homepage
    urls.append({
        "loc": f"{BASE_URL}/",
        "lastmod": today,
        "changefreq": "daily",
        "priority": "1.0"
    })

    # 1b. Festivals Hub & Dedicated Pages
    urls.append({
        "loc": f"{BASE_URL}/festivals/",
        "lastmod": today,
        "changefreq": "weekly",
        "priority": "0.95"
    })
    for fest in festivals:
        urls.append({
            "loc": f"{BASE_URL}/festivals/{fest['slug']}/",
            "lastmod": today,
            "changefreq": "weekly",
            "priority": "0.9"
        })

    # 1c. International Geo-Targeted Hubs
    urls.append({
        "loc": f"{BASE_URL}/emot-iphone/",
        "lastmod": today,
        "changefreq": "weekly",
        "priority": "0.95"
    })
    urls.append({
        "loc": f"{BASE_URL}/emojis-iphone-copiar/",
        "lastmod": today,
        "changefreq": "weekly",
        "priority": "0.95"
    })

    # 2. Categories
    for cat in categories:
        urls.append({
            "loc": f"{BASE_URL}/category/{cat['slug']}/",
            "lastmod": today,
            "changefreq": "weekly",
            "priority": "0.9"
        })

    # 3. Emojis
    for emo in emojis:
        urls.append({
            "loc": f"{BASE_URL}/emoji/{emo['slug']}/",
            "lastmod": today,
            "changefreq": "weekly",
            "priority": "0.8"
        })

    # 4. Guides
    for guide in guides:
        urls.append({
            "loc": f"{BASE_URL}/guides/{guide['slug']}/",
            "lastmod": guide.get("publishedDate", today),
            "changefreq": "monthly",
            "priority": "0.85"
        })

    # 5. Trust / Legal pages
    for page in ["about", "privacy", "terms", "contact", "affiliate-disclosure", "cookie-policy"]:
        urls.append({
            "loc": f"{BASE_URL}/{page}/",
            "lastmod": today,
            "changefreq": "yearly",
            "priority": "0.3"
        })

    # Write sitemap.xml
    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for u in urls:
        sitemap_lines.append("  <url>")
        sitemap_lines.append(f"    <loc>{u['loc']}</loc>")
        sitemap_lines.append(f"    <lastmod>{u['lastmod']}</lastmod>")
        sitemap_lines.append(f"    <changefreq>{u['changefreq']}</changefreq>")
        sitemap_lines.append(f"    <priority>{u['priority']}</priority>")
        sitemap_lines.append("  </url>")
    sitemap_lines.append("</urlset>\n")

    sitemap_path = os.path.join(PUBLIC_DIR, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap_lines))
    print(f"✅ Generated sitemap.xml with {len(urls)} URLs at {sitemap_path}")

    # Write robots.txt
    robots_content = f"""User-agent: *
Allow: /

# Sitemap
Sitemap: {BASE_URL}/sitemap.xml
"""
    robots_path = os.path.join(PUBLIC_DIR, "robots.txt")
    with open(robots_path, "w", encoding="utf-8") as f:
        f.write(robots_content)
    print(f"✅ Generated robots.txt at {robots_path}")

if __name__ == "__main__":
    generate_sitemap()
