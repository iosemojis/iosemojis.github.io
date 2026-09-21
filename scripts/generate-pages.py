#!/usr/bin/env python3
"""
Static Page Generator for Emoji Reference Site
Generates 100% static HTML pages:
- /emoji/<slug>/index.html
- /category/<slug>/index.html
- /guides/<slug>/index.html
- /about/index.html, /privacy/index.html, /terms/index.html, /contact/index.html, /affiliate-disclosure/index.html, /cookie-policy/index.html
- /404.html
Also triggers sitemap generation.
"""

import os
import sys
import json
import re

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
TEMPLATES_DIR = os.path.join(ROOT_DIR, "templates")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://iosemojis.github.io"

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_template(name):
    with open(os.path.join(TEMPLATES_DIR, name), "r", encoding="utf-8") as f:
        return f.read()

def get_header(active_nav=""):
    return f"""
  <header class="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-bold text-lg tracking-tight text-neutral-900">
        <span class="text-2xl">🍎</span>
        <span>iOS<span class="text-neutral-500">Emoji</span></span>
      </a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
        <a href="/" class="hover:text-neutral-900 transition-colors">Directory</a>
        <a href="/category/hearts-love/" class="hover:text-neutral-900 transition-colors">Hearts & Love</a>
        <a href="/category/smileys-emotions/" class="hover:text-neutral-900 transition-colors">Smileys</a>
        <a href="/guides/iphone-emoji/" class="hover:text-neutral-900 transition-colors">Guides</a>
        <a href="/about/" class="hover:text-neutral-900 transition-colors">About</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="/" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-800 transition-colors">
          <span>🔍</span>
          <span class="hidden sm:inline">Search Emojis</span>
        </a>
      </div>
    </div>
  </header>
"""

def get_footer():
    return f"""
  <footer class="mt-20 border-t border-neutral-200 bg-white text-neutral-600 text-sm">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 font-bold text-neutral-900 text-base mb-3">
            <span>🍎</span>
            <span>iOS Emoji Keyboard</span>
          </div>
          <p class="text-neutral-500 text-xs leading-relaxed">
            Authentic Unicode emoji dictionary, platform-aware rendering reference, and developer copy snippets for iOS, Android, and Web.
          </p>
          <div class="mt-3 pt-3 border-t border-neutral-100 text-xs">
            <span class="text-neutral-400">Featured Resource: </span>
            <a href="https://emojisymbols.netlify.app/" target="_blank" rel="noopener" class="text-blue-600 hover:underline font-semibold">✨ Emoji Symbols &amp; Font Generator ↗</a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-neutral-900 mb-3">Top Categories</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/category/hearts-love/" class="hover:text-neutral-900">Hearts & Love Emojis</a></li>
            <li><a href="/category/smileys-emotions/" class="hover:text-neutral-900">Smileys & Emotions</a></li>
            <li><a href="/category/viral-emojis/" class="hover:text-neutral-900">Trending Viral Emojis</a></li>
            <li><a href="/category/festivals-holidays/" class="hover:text-neutral-900">Diwali & Festive Emojis</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-neutral-900 mb-3">Guides & Tutorials</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/guides/iphone-emoji/" class="hover:text-neutral-900">iPhone Emoji System Guide</a></li>
            <li><a href="/guides/heart-emoji-meanings/" class="hover:text-neutral-900">Heart Emoji Color Meanings</a></li>
            <li><a href="/guides/religious-emojis/" class="hover:text-neutral-900">Spiritual & Sacred Symbols</a></li>
            <li><a href="https://emojisymbols.netlify.app/" target="_blank" rel="noopener" class="text-blue-600 hover:underline font-medium">✨ Fancy Text &amp; Emoji Symbols</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-neutral-900 mb-3">Legal & Trust</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/about/" class="hover:text-neutral-900">About Us</a></li>
            <li><a href="/privacy/" class="hover:text-neutral-900">Privacy Policy</a></li>
            <li><a href="/terms/" class="hover:text-neutral-900">Terms of Service</a></li>
            <li><a href="/contact/" class="hover:text-neutral-900">Contact Us</a></li>
            <li><a href="/affiliate-disclosure/" class="hover:text-neutral-900">Affiliate Disclosure</a></li>
            <li><a href="/cookie-policy/" class="hover:text-neutral-900">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-neutral-100 pt-6 text-xs text-neutral-400 space-y-2">
        <p>
          <strong>Platform Disclaimer:</strong> Emoji appearance and naming may vary across platforms. This site provides informational Unicode reference content and is not affiliated with Apple, Google, Samsung, Microsoft, Unicode Consortium, WhatsApp, Meta, TikTok, X, or Telegram unless explicitly stated. Do not scrape or redistribute proprietary emoji artwork.
        </p>
        <p>© {2025} iOS Emoji Reference Hub. All Unicode character codes cataloged accurately under standard specifications.</p>
      </div>
    </div>
  </footer>
"""

def generate_pages():
    emojis = load_json(os.path.join(DATA_DIR, "emojis.json"))
    categories = load_json(os.path.join(DATA_DIR, "categories.json"))
    guides = load_json(os.path.join(DATA_DIR, "guides.json"))

    cat_by_slug = {c["slug"]: c for c in categories}
    emo_by_slug = {e["slug"]: e for e in emojis}

    emoji_template = load_template("emoji.html")
    category_template = load_template("category.html")
    article_template = load_template("article.html")

    header_html = get_header()
    footer_html = get_footer()

    # 1. Generate Emoji Pages
    print("Generating single programmatic emoji pages...")
    for emo in emojis:
        slug = emo["slug"]
        out_dir = os.path.join(PUBLIC_DIR, "emoji", slug)
        os.makedirs(out_dir, exist_ok=True)

        cat_slug = emo["category"]
        cat_info = cat_by_slug.get(cat_slug, {"name": "Emojis", "slug": "smileys-emotions"})

        canonical_url = f"{BASE_URL}/emoji/{slug}/"
        title = f"{emo['emoji']} {emo['name']} iPhone Emoji — Meaning, Copy & Download Apple Emoji PNG"
        description = f"Copy {emo['emoji']} {emo['name']} iPhone emoji in 1 click. Discover the true meaning of this apple emoji, download 512px transparent PNG, and learn how to use emot iPhone on Android."
        h1 = f"{emo['emoji']} {emo['name']} iPhone Emoji"

        # Breadcrumbs
        breadcrumbs = f"""
        <nav aria-label="Breadcrumb" class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
          <a href="/" class="hover:text-neutral-800">Home</a>
          <span>/</span>
          <a href="/category/{cat_slug}/" class="hover:text-neutral-800">{cat_info['name']}</a>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{emo['name']}</span>
        </nav>
        """

        # JSON-LD
        json_ld_data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": canonical_url,
                    "url": canonical_url,
                    "name": title,
                    "description": description,
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
                            {"@type": "ListItem", "position": 2, "name": cat_info["name"], "item": f"{BASE_URL}/category/{cat_slug}/"},
                            {"@type": "ListItem", "position": 3, "name": emo["name"], "item": canonical_url}
                        ]
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {"@type": "Question", "name": f["question"], "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}}
                        for f in emo.get("faqs", [])
                    ]
                }
            ]
        }
        json_ld = json.dumps(json_ld_data, indent=2, ensure_ascii=False)

        # Copy buttons
        copy_buttons = f"""
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">Character Glyph</div>
            <div class="font-bold text-lg text-neutral-900 mb-2">{emo['emoji']}</div>
            <button onclick="navigator.clipboard.writeText('{emo['emoji']}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy Character', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy Character
            </button>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">Unicode Code Points</div>
            <div class="font-mono text-xs text-neutral-900 mb-2 font-bold">{", ".join(emo['unicode'])}</div>
            <button onclick="navigator.clipboard.writeText('{" ".join(emo['unicode'])}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy Unicode', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy Unicode
            </button>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">HTML Entity</div>
            <div class="font-mono text-xs text-neutral-900 mb-2 font-bold">{emo['htmlEntity']}</div>
            <button onclick="navigator.clipboard.writeText('{emo['htmlEntity']}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy HTML', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy HTML
            </button>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">CSS Escape</div>
            <div class="font-mono text-xs text-neutral-900 mb-2 font-bold">{emo['cssEscape']}</div>
            <button onclick="navigator.clipboard.writeText('{emo['cssEscape']}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy CSS', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy CSS
            </button>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">JavaScript String</div>
            <div class="font-mono text-xs text-neutral-900 mb-2 font-bold">{emo['jsEscape']}</div>
            <button onclick="navigator.clipboard.writeText('{emo['jsEscape']}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy JS', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy JS
            </button>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500 mb-1">URL Encoded</div>
            <div class="font-mono text-xs text-neutral-900 mb-2 font-bold">{emo['urlEncoded']}</div>
            <button onclick="navigator.clipboard.writeText('{emo['urlEncoded']}'); this.innerText='✓ Copied!'; setTimeout(()=>this.innerText='Copy URL Code', 1500);" class="w-full py-1.5 px-3 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Copy URL Code
            </button>
          </div>
        """

        # FAQs HTML
        faqs_html = "\n".join([
            f"""
            <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
                <span>{f['question']}</span>
                <span class="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p class="mt-3 text-neutral-600 text-sm leading-relaxed">{f['answer']}</p>
            </details>
            """
            for f in emo.get("faqs", [])
        ])

        # Related Emojis
        related_html_list = []
        for rel_slug in emo.get("related", []):
            rel_emo = emo_by_slug.get(rel_slug)
            if rel_emo:
                related_html_list.append(f"""
                <a href="/emoji/{rel_slug}/" class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-white transition-all flex items-center gap-3">
                  <span class="text-2xl">{rel_emo['emoji']}</span>
                  <div class="overflow-hidden">
                    <div class="font-medium text-xs text-neutral-900 truncate">{rel_emo['name']}</div>
                    <div class="text-[10px] text-neutral-500 uppercase">{rel_emo['unicode'][0]}</div>
                  </div>
                </a>
                """)
        related_emojis_html = "\n".join(related_html_list)

        rendered = emoji_template
        rendered = rendered.replace("{{title}}", title)
        rendered = rendered.replace("{{description}}", description)
        rendered = rendered.replace("{{canonical_url}}", canonical_url)
        rendered = rendered.replace("{{json_ld}}", json_ld)
        rendered = rendered.replace("{{header}}", header_html)
        rendered = rendered.replace("{{footer}}", footer_html)
        rendered = rendered.replace("{{breadcrumbs}}", breadcrumbs)
        rendered = rendered.replace("{{emoji}}", emo["emoji"])
        rendered = rendered.replace("{{name}}", emo["name"])
        rendered = rendered.replace("{{h1}}", h1)
        rendered = rendered.replace("{{shortMeaning}}", emo["shortMeaning"])
        rendered = rendered.replace("{{copy_buttons}}", copy_buttons)
        rendered = rendered.replace("{{meanings_texting}}", emo["meanings"].get("texting", ""))
        rendered = rendered.replace("{{meanings_general}}", emo["meanings"].get("general", ""))
        rendered = rendered.replace("{{meanings_romantic}}", emo["meanings"].get("romantic", ""))
        rendered = rendered.replace("{{meanings_friendship}}", emo["meanings"].get("friendship", ""))
        rendered = rendered.replace("{{meanings_socialMedia}}", emo["meanings"].get("socialMedia", ""))
        rendered = rendered.replace("{{unicode_points}}", ", ".join(emo["unicode"]))
        rendered = rendered.replace("{{htmlEntity}}", emo["htmlEntity"])
        rendered = rendered.replace("{{cssEscape}}", emo["cssEscape"])
        rendered = rendered.replace("{{jsEscape}}", emo["jsEscape"])
        rendered = rendered.replace("{{urlEncoded}}", emo["urlEncoded"])
        rendered = rendered.replace("{{category_slug}}", cat_slug)
        rendered = rendered.replace("{{category_name}}", cat_info["name"])
        rendered = rendered.replace("{{faqs_html}}", faqs_html)
        rendered = rendered.replace("{{related_emojis_html}}", related_emojis_html)

        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(rendered)

    # 2. Generate Category Pages
    print("Generating category pages...")
    for cat in categories:
        c_slug = cat["slug"]
        out_dir = os.path.join(PUBLIC_DIR, "category", c_slug)
        os.makedirs(out_dir, exist_ok=True)

        canonical_url = f"{BASE_URL}/category/{c_slug}/"
        title = f"{cat['name']} Emojis — Copy, Meanings & Codes | iOS Emoji"
        description = cat["description"]

        cat_emojis = [e for e in emojis if e["category"] == c_slug]

        breadcrumbs = f"""
        <nav aria-label="Breadcrumb" class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
          <a href="/" class="hover:text-neutral-800">Home</a>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{cat['name']}</span>
        </nav>
        """

        json_ld_data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": f"{cat['name']} iPhone Emojis — Copy, Meanings & Codes",
                    "description": cat["description"],
                    "url": canonical_url,
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
                            {"@type": "ListItem", "position": 2, "name": cat["name"], "item": canonical_url}
                        ]
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": f"How do I copy {cat['name']} emojis for iPhone?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f"Click any {cat['name']} emoji on this page to copy it to your clipboard. You can paste it immediately into WhatsApp, Instagram, iMessage, TikTok, or Twitter/X."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": f"Do these {cat['name']} emojis look like Apple iOS emojis on Android and Windows?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "When you paste these Unicode characters, they render using Apple's font on iPhones/iPads/Macs, and the native device emoji font on Android or Windows. When sent to an iPhone user, they always appear as authentic Apple emojis."
                            }
                        }
                    ]
                }
            ]
        }
        json_ld = json.dumps(json_ld_data, indent=2, ensure_ascii=False)

        grid_items = []
        for e in cat_emojis:
            grid_items.append(f"""
            <a href="/emoji/{e['slug']}/" class="p-4 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col items-center text-center">
              <span class="text-4xl mb-2">{e['emoji']}</span>
              <span class="font-semibold text-xs text-neutral-900 line-clamp-1">{e['name']}</span>
              <span class="text-[10px] text-neutral-400 font-mono mt-1">{e['unicode'][0]}</span>
            </a>
            """)
        emoji_grid_html = "\n".join(grid_items)

        # Related categories
        rel_cats = []
        for other in categories:
            if other["slug"] != c_slug:
                rel_cats.append(f"""
                <a href="/category/{other['slug']}/" class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:bg-white hover:border-neutral-400 transition-all flex items-center gap-3">
                  <span class="text-2xl">{other['icon']}</span>
                  <div class="font-medium text-xs text-neutral-900">{other['name']}</div>
                </a>
                """)
        related_categories_html = "\n".join(rel_cats[:6])

        # FAQs
        faqs_html = "\n".join([
            f"""
            <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
                <span>{f['question']}</span>
                <span class="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p class="mt-3 text-neutral-600 text-sm leading-relaxed">{f['answer']}</p>
            </details>
            """
            for f in cat.get("faqs", [])
        ])

        rendered = category_template
        rendered = rendered.replace("{{title}}", title)
        rendered = rendered.replace("{{description}}", description)
        rendered = rendered.replace("{{canonical_url}}", canonical_url)
        rendered = rendered.replace("{{json_ld}}", json_ld)
        rendered = rendered.replace("{{header}}", header_html)
        rendered = rendered.replace("{{footer}}", footer_html)
        rendered = rendered.replace("{{breadcrumbs}}", breadcrumbs)
        rendered = rendered.replace("{{icon}}", cat["icon"])
        rendered = rendered.replace("{{h1}}", cat["h1"])
        rendered = rendered.replace("{{name}}", cat["name"])
        rendered = rendered.replace("{{introCopy}}", cat["introCopy"])
        rendered = rendered.replace("{{emoji_count}}", str(len(cat_emojis)))
        rendered = rendered.replace("{{emoji_grid_html}}", emoji_grid_html)
        rendered = rendered.replace("{{faqs_html}}", faqs_html)
        rendered = rendered.replace("{{related_categories_html}}", related_categories_html)

        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(rendered)

    # 3. Generate Guides Pages
    print("Generating editorial guide pages...")
    for guide in guides:
        g_slug = guide["slug"]
        out_dir = os.path.join(PUBLIC_DIR, "guides", g_slug)
        os.makedirs(out_dir, exist_ok=True)

        canonical_url = f"{BASE_URL}/guides/{g_slug}/"
        title = f"{guide['title']} | iOS Emoji Guides"
        description = guide["description"]

        breadcrumbs = f"""
        <nav aria-label="Breadcrumb" class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
          <a href="/" class="hover:text-neutral-800">Home</a>
          <span>/</span>
          <span class="text-neutral-500">Guides</span>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{guide['title']}</span>
        </nav>
        """

        json_ld_data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "headline": guide["h1"],
                    "description": guide["description"],
                    "datePublished": guide["publishedDate"],
                    "author": {"@type": "Organization", "name": guide["author"]},
                    "url": canonical_url,
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
                            {"@type": "ListItem", "position": 2, "name": "Guides", "item": f"{BASE_URL}/guides/{g_slug}/"}
                        ]
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {"@type": "Question", "name": f["question"], "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}}
                        for f in guide.get("faqs", [])
                    ]
                }
            ]
        }
        json_ld = json.dumps(json_ld_data, indent=2, ensure_ascii=False)

        sections_html = "\n".join([
            f"""
            <section class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <h2 class="text-xl font-bold text-neutral-900">{sec['heading']}</h2>
              <p class="text-neutral-700 leading-relaxed">{sec['body']}</p>
            </section>
            """
            for sec in guide["contentSections"]
        ])

        rel_emojis = []
        for r_slug in guide.get("relevantEmojis", []):
            e = emo_by_slug.get(r_slug)
            if e:
                rel_emojis.append(f"""
                <a href="/emoji/{e['slug']}/" class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-white transition-all flex items-center gap-3">
                  <span class="text-3xl">{e['emoji']}</span>
                  <div class="overflow-hidden">
                    <div class="font-medium text-xs text-neutral-900 truncate">{e['name']}</div>
                    <div class="text-[10px] text-neutral-500 uppercase">{e['unicode'][0]}</div>
                  </div>
                </a>
                """)
        relevant_emojis_html = "\n".join(rel_emojis)

        faqs_html = "\n".join([
            f"""
            <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
                <span>{f['question']}</span>
                <span class="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p class="mt-3 text-neutral-600 text-sm leading-relaxed">{f['answer']}</p>
            </details>
            """
            for f in guide.get("faqs", [])
        ])

        rendered = article_template
        rendered = rendered.replace("{{title}}", title)
        rendered = rendered.replace("{{description}}", description)
        rendered = rendered.replace("{{canonical_url}}", canonical_url)
        rendered = rendered.replace("{{json_ld}}", json_ld)
        rendered = rendered.replace("{{header}}", header_html)
        rendered = rendered.replace("{{footer}}", footer_html)
        rendered = rendered.replace("{{breadcrumbs}}", breadcrumbs)
        rendered = rendered.replace("{{h1}}", guide["h1"])
        rendered = rendered.replace("{{author}}", guide["author"])
        rendered = rendered.replace("{{publishedDate}}", guide["publishedDate"])
        rendered = rendered.replace("{{readingTime}}", guide["readingTime"])
        rendered = rendered.replace("{{content_sections_html}}", sections_html)
        rendered = rendered.replace("{{relevant_emojis_html}}", relevant_emojis_html)
        rendered = rendered.replace("{{faqs_html}}", faqs_html)

        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(rendered)

    # 4. Generate 404 Page
    print("Generating 404.html...")
    popular_chips = " ".join([
        f'<a href="/emoji/{e["slug"]}/" class="text-3xl p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 hover:scale-110 transition-transform shadow-xs">{e["emoji"]}</a>'
        for e in emojis[:8]
    ])
    page_404_html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 — Emoji Not Found | iOS Emoji</title>
  <meta name="robots" content="noindex, follow" />
  <link rel="stylesheet" href="/src/index.css" />
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased min-h-screen flex flex-col justify-between">
  {header_html}
  <main class="max-w-2xl mx-auto px-4 py-16 text-center my-auto">
    <div class="text-8xl mb-6">😶</div>
    <h1 class="text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">404 — Emoji Not Found</h1>
    <p class="text-neutral-600 text-lg mb-8">We couldn't find that emoji page or URL. It may have moved or been updated under official Unicode standard sequences.</p>
    <div class="mb-10 flex items-center justify-center gap-3">
      <a href="/" class="px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors shadow-xs">
        Return to Emoji Directory
      </a>
    </div>
    <div>
      <div class="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-4">Or explore popular emojis:</div>
      <div class="flex flex-wrap justify-center gap-3">
        {popular_chips}
      </div>
    </div>
  </main>
  {footer_html}
</body>
</html>
"""
    with open(os.path.join(PUBLIC_DIR, "404.html"), "w", encoding="utf-8") as f:
        f.write(page_404_html)

    # 5. Generate Trust / Legal Pages
    legal_pages = {
        "about": (
            "About iOS Emoji & Unicode Reference",
            "Learn about the mission of iOS Emoji: providing high-accuracy Unicode reference data, developer copy tools, and platform-neutral emoji educational guides.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">About iOS Emoji Reference</h1>
            <p class="text-neutral-700 leading-relaxed mb-4">iOS Emoji is a comprehensive, open reference library providing standardized Unicode character code points, contextual texting definitions, and developer utilities for digital symbols.</p>
            <h2 class="text-2xl font-bold mt-6 mb-3">Our Mission</h2>
            <p class="text-neutral-700 leading-relaxed mb-4">Our objective is to deliver authoritative, platform-aware documentation for every emoji character in the Unicode standard. We help software developers, digital marketers, designers, and everyday communicators accurately copy, inspect, and understand the cultural nuances of modern digital pictographs.</p>
            <h2 class="text-2xl font-bold mt-6 mb-3">Unicode Integrity</h2>
            <p class="text-neutral-700 leading-relaxed mb-4">Every emoji in our index is cataloged according to official Unicode specifications, properly reflecting Variation Selectors (VS-16) and Zero Width Joiner (ZWJ) compound sequences. We respect the proprietary copyrights of platform vendors (Apple, Google, Microsoft, Samsung) and clearly explain font-dependent rendering differences.</p>
            """
        ),
        "privacy": (
            "Privacy Policy",
            "Read the Privacy Policy for iOS Emoji: no personal information harvested, privacy-safe analytics, and transparent cookie practices.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p class="text-sm text-neutral-500 mb-6">Last updated: January 2025</p>
            <p class="text-neutral-700 leading-relaxed mb-4">Your privacy is paramount. iOS Emoji does not require registration, user accounts, or transmission of personal data. All search filtering, clipboard copying, and PNG canvas rendering operations occur entirely within your local web browser.</p>
            <h2 class="text-2xl font-bold mt-6 mb-3">Analytics & Advertising</h2>
            <p class="text-neutral-700 leading-relaxed mb-4">We employ Google Tag Manager and Google AdSense to serve non-intrusive advertisements and monitor aggregate site performance. Third-party advertising vendors may use cookies to serve ads based on prior visits. You may opt out of personalized advertising by visiting Google Ad Settings.</p>
            """
        ),
        "terms": (
            "Terms of Service",
            "Terms of Service for using iOS Emoji directory, developer snippets, and educational emoji guides.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
            <p class="text-neutral-700 leading-relaxed mb-4">By accessing and utilizing this website, you agree to these Terms of Service. All informational content, Unicode data mappings, and guide materials are provided for educational and utility purposes.</p>
            <h2 class="text-2xl font-bold mt-6 mb-3">Intellectual Property Disclaimer</h2>
            <p class="text-neutral-700 leading-relaxed mb-4">Apple, iPhone, iOS, iPadOS, and macOS are registered trademarks of Apple Inc. This independent educational reference site is not affiliated with, sponsored by, or endorsed by Apple Inc., Google LLC, Microsoft Corporation, Samsung Electronics, or the Unicode Consortium. All emoji character glyphs displayed on this site are rendered using the viewer's native operating system font.</p>
            """
        ),
        "contact": (
            "Contact Us",
            "Get in touch with the iOS Emoji editorial and technical curation team for corrections, feedback, and Unicode suggestions.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p class="text-neutral-700 leading-relaxed mb-6">Have a question regarding Unicode sequences, an error report on an emoji page, or an editorial inquiry? We welcome your feedback.</p>
            <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 max-w-lg">
              <h3 class="font-bold text-neutral-900 mb-2">Editorial & Technical Support</h3>
              <p class="text-sm text-neutral-600 mb-4">Reach out to our dataset curators via email:</p>
              <a href="mailto:calligraphyeasy@gmail.com" class="font-mono text-sm font-bold text-blue-600 hover:underline block">calligraphyeasy@gmail.com</a>
              <div class="text-xs text-neutral-500 mt-2">Direct / Alternative: <a href="mailto:seoprasoon@gmail.com" class="text-blue-600 hover:underline">seoprasoon@gmail.com</a></div>
            </div>
            """
        ),
        "affiliate-disclosure": (
            "Affiliate Disclosure",
            "Read our FTC compliant affiliate disclosure regarding contextual product recommendations on iOS Emoji.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Affiliate Disclosure</h1>
            <p class="text-neutral-700 leading-relaxed mb-4">In compliance with FTC guidelines, please note that certain editorial guides on this website may contain contextual affiliate links to relevant products (such as tactile smartphone keyboards, accessories, or software development books).</p>
            <p class="text-neutral-700 leading-relaxed mb-4">If you click an affiliate link and make a purchase, we may receive a small commission at zero additional cost to you. We strictly disallow automated or non-contextual affiliate insertions into pure emoji reference records.</p>
            """
        ),
        "cookie-policy": (
            "Cookie Policy",
            "Understand how local preferences and analytics cookies are utilized on iOS Emoji.",
            """
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
            <p class="text-neutral-700 leading-relaxed mb-4">This Cookie Policy explains how iOS Emoji uses cookies and local browser storage (such as localStorage for dark/light theme preferences) to enhance your browsing experience.</p>
            <p class="text-neutral-700 leading-relaxed mb-4">Cookies may be set by third-party advertising and analytics services to measure traffic and prevent repetitive ad display. You can control or block cookies at any time via your browser settings.</p>
            """
        )
    }

    for page_key, (page_title, page_desc, page_body) in legal_pages.items():
        out_dir = os.path.join(PUBLIC_DIR, page_key)
        os.makedirs(out_dir, exist_ok=True)
        canonical_url = f"{BASE_URL}/{page_key}/"

        html_content = f"""<!doctype html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JL0C3QP4F5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());

    gtag('config', 'G-JL0C3QP4F5');
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{page_title} | iOS Emoji</title>
  <meta name="description" content="{page_desc}" />
  <link rel="canonical" href="{canonical_url}" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <link rel="stylesheet" href="/assets/app.css" />
  <style>
    :root {{
      --emoji-font: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "Segoe UI Symbol", "Twemoji Mozilla", emoji, sans-serif;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, var(--emoji-font);
    }}
    .custom-horizontal-scrollbar {{
      scrollbar-width: thin !important;
      scrollbar-color: #64748b #e2e8f0 !important;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar {{
      height: 10px !important;
      display: block !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #e2e8f0 !important;
      border-radius: 9999px !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #64748b !important;
      border-radius: 9999px !important;
      border: 2px solid #e2e8f0 !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #334155 !important;
    }}
    .dark .custom-horizontal-scrollbar {{
      scrollbar-color: #60a5fa #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #1e293b !important;
      border-radius: 9999px !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #60a5fa !important;
      border-radius: 9999px !important;
      border: 2px solid #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #93c5fd !important;
    }}
  </style>
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased min-h-screen flex flex-col justify-between">
  {header_html}
  <main class="max-w-3xl mx-auto px-4 py-12 w-full">
    <div class="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs">
      {page_body}
    </div>
  </main>
  {footer_html}
</body>
</html>
"""
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(html_content)

    # 6. Generate International Geo-SEO Landing Pages
    print("Generating international Geo-SEO landing pages (/emot-iphone/ & /emojis-iphone-copiar/)...")
    generate_geo_pages(emojis, categories, header_html, footer_html)

    print("Triggering sitemap and robots generation...")
    import subprocess
    import sys
    subprocess.run([sys.executable, os.path.join(ROOT_DIR, "scripts", "generate-sitemap.py")], check=True)
    print("✅ All static pages generated successfully!")

def generate_geo_pages(emojis, categories, header_html, footer_html):
    top_emojis = emojis[:120]

    # --- 1. Indonesian Hub: /emot-iphone/ ---
    id_dir = os.path.join(PUBLIC_DIR, "emot-iphone")
    os.makedirs(id_dir, exist_ok=True)
    id_canonical = f"{BASE_URL}/emot-iphone/"
    id_title = "Salin Emot iPhone — Kumpulan Emoticon Apple iOS untuk WA, IG & Android"
    id_desc = "Salin dan tempel emot iPhone asli (Apple emoji) dalam 1 klik. Koleksi lengkap emotikon iOS terbaru untuk WhatsApp, Instagram, TikTok & HP Android gratis."

    id_cards = []
    for emo in top_emojis:
        id_cards.append(f"""
        <button onclick="navigator.clipboard.writeText('{emo['emoji']}'); showGeoToast('Emot {emo['emoji']} berhasil disalin!');" class="p-3 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col items-center justify-center gap-1 group shadow-2xs cursor-pointer active:scale-95">
          <span class="text-3xl select-all">{emo['emoji']}</span>
          <span class="text-[10px] text-neutral-500 font-medium truncate w-full text-center group-hover:text-neutral-900">{emo['name']}</span>
        </button>
        """)
    id_grid_html = "\n".join(id_cards)

    id_json_ld = json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": id_canonical,
                "url": id_canonical,
                "name": id_title,
                "description": id_desc,
                "inLanguage": "id",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Beranda", "item": f"{BASE_URL}/"},
                        {"@type": "ListItem", "position": 2, "name": "Salin Emot iPhone", "item": id_canonical}
                    ]
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Bagaimana cara menyalin emot iPhone ke HP Android?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Cukup klik atau sentuh emotikon Apple mana saja di halaman ini, maka emotikon akan langsung tersalin ke clipboard Anda. Buka WhatsApp atau Instagram, lalu tekan lama kolom chat dan pilih Tempel (Paste)."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Apakah emot iPhone bisa muncul di WhatsApp?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ya, WhatsApp secara default menggunakan set emotikon berdesain Apple iOS pada aplikasi Android dan Web. Jadi emotikon yang Anda salin dari sini akan terlihat persis seperti emoji di iPhone."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Mengapa emotikon di iPhone terlihat berbeda dengan Android?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Setiap vendor sistem operasi (Apple, Google, Samsung) memiliki font gaya grafis sendiri untuk karakter Unicode yang sama. Apple mendesain emotikon dengan gaya 3D realistis dan ekspresi yang khas."
                        }
                    }
                ]
            }
        ]
    }, indent=2, ensure_ascii=False)

    id_html = f"""<!doctype html>
<html lang="id">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JL0C3QP4F5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-JL0C3QP4F5');
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{id_title}</title>
  <meta name="description" content="{id_desc}" />
  <link rel="canonical" href="{id_canonical}" />
  <link rel="alternate" hreflang="id" href="{id_canonical}" />
  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <meta property="og:title" content="{id_title}" />
  <meta property="og:description" content="{id_desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{id_canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/app.css" />
  <style>
    :root {{
      --emoji-font: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "Segoe UI Symbol", "Twemoji Mozilla", emoji, sans-serif;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, var(--emoji-font);
    }}
    .custom-horizontal-scrollbar {{
      scrollbar-width: thin !important;
      scrollbar-color: #64748b #e2e8f0 !important;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar {{
      height: 10px !important;
      display: block !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #e2e8f0 !important;
      border-radius: 9999px !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #64748b !important;
      border-radius: 9999px !important;
      border: 2px solid #e2e8f0 !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #334155 !important;
    }}
    .dark .custom-horizontal-scrollbar {{
      scrollbar-color: #60a5fa #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #1e293b !important;
      border-radius: 9999px !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #60a5fa !important;
      border-radius: 9999px !important;
      border: 2px solid #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #93c5fd !important;
    }}
  </style>
  <script type="application/ld+json">
  {id_json_ld}
  </script>
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased min-h-screen flex flex-col justify-between">
  {header_html}

  <main class="max-w-5xl mx-auto px-4 py-10 w-full space-y-10">
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-neutral-200/60 rounded-full text-xs font-semibold text-neutral-700 mb-2">
        <span>🇮🇩</span> Salin Emoticon Apple iOS Gratis
      </div>
      <h1 class="text-3xl md:text-5xl font-black tracking-tight text-neutral-900">
        Salin Emot iPhone Online
      </h1>
      <p class="text-neutral-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        Klik langsung pada emotikon di bawah untuk menyalin ke clipboard. Paste ke chat WhatsApp, caption Instagram, TikTok, Twitter/X, atau bio sosial mediamu!
      </p>
    </div>

    <!-- Live Toast -->
    <div id="geo-toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-sm flex items-center gap-2 pointer-events-none">
      <span>✓</span> <span id="geo-toast-msg">Tersalin!</span>
    </div>

    <!-- Quick Copy Grid -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
        <h2 class="font-bold text-neutral-800 text-base">🔥 Emot iPhone Paling Populer</h2>
        <span class="text-xs text-neutral-400">Sentuh untuk salin</span>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {id_grid_html}
      </div>
    </div>

    <!-- Content Sections for SEO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 class="font-bold text-lg text-neutral-900">📱 Cara Pakai Emot iPhone di HP Android</h3>
        <p class="text-neutral-600 text-sm leading-relaxed">
          Banyak pengguna Android menyukai gaya emotikon iPhone karena tampilannya yang lebih ekspresif dan mengkilap (glossy). Dengan menyalin emot dari halaman ini, kamu tidak perlu menginstall aplikasi font pihak ketiga yang berbahaya atau me-root ponsel. Cukup klik emotikon yang kamu suka, lalu tempelkan (paste) langsung ke kolom chat WhatsApp atau status.
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 class="font-bold text-lg text-neutral-900">✨ Trik Emot iPhone untuk Bio Instagram & WA</h3>
        <p class="text-neutral-600 text-sm leading-relaxed">
          Agar profil media sosialmu terlihat lebih estetik, padukan emotikon hati (heart), kilauan (sparkles), dan ekspresi senyum dengan teks tebal atau font estetik. Kamu juga dapat mengunjungi koleksi lengkap kami di <a href="/category/hearts-love/" class="text-blue-600 font-semibold hover:underline">Kategori Hearts & Love</a> atau <a href="https://emojisymbols.netlify.app/" target="_blank" rel="noopener" class="text-blue-600 font-semibold hover:underline">Emoji Symbols Generator</a>.
        </p>
      </div>
    </div>

    <!-- FAQs Section -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
      <h3 class="font-bold text-xl text-neutral-900 mb-2">❓ Tanya Jawab Seputar Emot iPhone</h3>
      <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
          <span>Bagaimana cara menyalin emot iPhone ke HP Android?</span>
          <span class="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <p class="mt-3 text-neutral-600 text-sm leading-relaxed">Cukup klik atau sentuh emotikon Apple mana saja di halaman ini, maka emotikon akan langsung tersalin ke clipboard Anda. Buka WhatsApp atau Instagram, lalu tekan lama kolom chat dan pilih Tempel (Paste).</p>
      </details>
      <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
          <span>Apakah emot iPhone bisa muncul di WhatsApp?</span>
          <span class="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <p class="mt-3 text-neutral-600 text-sm leading-relaxed">Ya, WhatsApp secara default menggunakan set emotikon berdesain Apple iOS pada aplikasi Android dan Web. Jadi emotikon yang Anda salin dari sini akan terlihat persis seperti emoji di iPhone.</p>
      </details>
      <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
          <span>Mengapa emotikon di iPhone terlihat berbeda dengan Android?</span>
          <span class="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <p class="mt-3 text-neutral-600 text-sm leading-relaxed">Setiap vendor sistem operasi (Apple, Google, Samsung) memiliki font gaya grafis sendiri untuk karakter Unicode yang sama. Apple mendesain emotikon dengan gaya 3D realistis dan ekspresi yang khas.</p>
      </details>
    </div>
  </main>

  <script>
    function showGeoToast(msg) {{
      var toast = document.getElementById('geo-toast');
      var toastMsg = document.getElementById('geo-toast-msg');
      toastMsg.innerText = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(function() {{
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }}, 2000);
    }}
  </script>

  {footer_html}
</body>
</html>
"""
    with open(os.path.join(id_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(id_html)

    # --- 2. Spanish Hub: /emojis-iphone-copiar/ ---
    es_dir = os.path.join(PUBLIC_DIR, "emojis-iphone-copiar")
    os.makedirs(es_dir, exist_ok=True)
    es_canonical = f"{BASE_URL}/emojis-iphone-copiar/"
    es_title = "Emojis de iPhone para Copiar y Pegar — Apple Emojis para WhatsApp y Android"
    es_desc = "Copia y pega emojis de iPhone originales con 1 clic. Colección completa de emoticones de Apple iOS para WhatsApp, Instagram, TikTok y teléfonos Android."

    es_cards = []
    for emo in top_emojis:
        es_cards.append(f"""
        <button onclick="navigator.clipboard.writeText('{emo['emoji']}'); showGeoToast('¡Emoji {emo['emoji']} copiado!');" class="p-3 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col items-center justify-center gap-1 group shadow-2xs cursor-pointer active:scale-95">
          <span class="text-3xl select-all">{emo['emoji']}</span>
          <span class="text-[10px] text-neutral-500 font-medium truncate w-full text-center group-hover:text-neutral-900">{emo['name']}</span>
        </button>
        """)
    es_grid_html = "\n".join(es_cards)

    es_json_ld = json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": es_canonical,
                "url": es_canonical,
                "name": es_title,
                "description": es_desc,
                "inLanguage": "es",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{BASE_URL}/"},
                        {"@type": "ListItem", "position": 2, "name": "Emojis iPhone Copiar", "item": es_canonical}
                    ]
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "¿Cómo copiar emojis de iPhone en Android?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Toca o haz clic en cualquier emoji de Apple de esta página y se copiará automáticamente en tu portapapeles. Luego abre WhatsApp o Instagram y selecciona Pegar."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "¿Por qué los emojis de iPhone se ven diferentes en WhatsApp?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "WhatsApp utiliza el conjunto oficial de emojis con diseño similar al de Apple en todas sus plataformas. Por lo tanto, cualquier emoji que copies aquí se verá idéntico al de un iPhone en tus conversaciones."
                        }
                    }
                ]
            }
        ]
    }, indent=2, ensure_ascii=False)

    es_html = f"""<!doctype html>
<html lang="es">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JL0C3QP4F5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-JL0C3QP4F5');
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{es_title}</title>
  <meta name="description" content="{es_desc}" />
  <link rel="canonical" href="{es_canonical}" />
  <link rel="alternate" hreflang="es" href="{es_canonical}" />
  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>" />
  <meta property="og:title" content="{es_title}" />
  <meta property="og:description" content="{es_desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{es_canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/app.css" />
  <style>
    :root {{
      --emoji-font: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "Segoe UI Symbol", "Twemoji Mozilla", emoji, sans-serif;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, var(--emoji-font);
    }}
    .custom-horizontal-scrollbar {{
      scrollbar-width: thin !important;
      scrollbar-color: #64748b #e2e8f0 !important;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar {{
      height: 10px !important;
      display: block !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #e2e8f0 !important;
      border-radius: 9999px !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #64748b !important;
      border-radius: 9999px !important;
      border: 2px solid #e2e8f0 !important;
    }}
    .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #334155 !important;
    }}
    .dark .custom-horizontal-scrollbar {{
      scrollbar-color: #60a5fa #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-track {{
      background: #1e293b !important;
      border-radius: 9999px !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {{
      background: #60a5fa !important;
      border-radius: 9999px !important;
      border: 2px solid #1e293b !important;
    }}
    .dark .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #93c5fd !important;
    }}
  </style>
  <script type="application/ld+json">
  {es_json_ld}
  </script>
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased min-h-screen flex flex-col justify-between">
  {header_html}

  <main class="max-w-5xl mx-auto px-4 py-10 w-full space-y-10">
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-neutral-200/60 rounded-full text-xs font-semibold text-neutral-700 mb-2">
        <span>🇪🇸</span> Emoticones de Apple iOS para Copiar
      </div>
      <h1 class="text-3xl md:text-5xl font-black tracking-tight text-neutral-900">
        Emojis de iPhone para Copiar y Pegar
      </h1>
      <p class="text-neutral-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        Haz clic en cualquier emoji para copiarlo al portapapeles al instante. Pégalo en WhatsApp, Instagram, TikTok, Facebook o tus estados.
      </p>
    </div>

    <!-- Live Toast -->
    <div id="geo-toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-neutral-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-sm flex items-center gap-2 pointer-events-none">
      <span>✓</span> <span id="geo-toast-msg">¡Copiado!</span>
    </div>

    <!-- Quick Copy Grid -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
        <h2 class="font-bold text-neutral-800 text-base">🔥 Emojis de iPhone Más Populares</h2>
        <span class="text-xs text-neutral-400">Toca para copiar</span>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {es_grid_html}
      </div>
    </div>

    <!-- Content Sections for SEO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 class="font-bold text-lg text-neutral-900">📲 Cómo Usar Emojis de iOS en Cualquier Celular</h3>
        <p class="text-neutral-600 text-sm leading-relaxed">
          Los emojis de Apple son mundialmente reconocidos por su diseño detallado y tridimensional. Con este teclado web en línea, puedes copiar cualquier símbolo y utilizarlo sin necesidad de cambiar de celular o instalar teclados externos. Al enviarlo a usuarios de iPhone o iPad, se reproducirá exactamente con el diseño nativo de iOS.
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 class="font-bold text-lg text-neutral-900">✨ Colecciones y Símbolos Especiales</h3>
        <p class="text-neutral-600 text-sm leading-relaxed">
          Explora también nuestras categorías completas de <a href="/category/hearts-love/" class="text-blue-600 font-semibold hover:underline">Corazones y Amor</a>, <a href="/category/smileys-emotions/" class="text-blue-600 font-semibold hover:underline">Caras y Emociones</a> o genera letras bonitas con <a href="https://emojisymbols.netlify.app/" target="_blank" rel="noopener" class="text-blue-600 font-semibold hover:underline">Emoji Symbols Generator</a>.
        </p>
      </div>
    </div>

    <!-- FAQs Section -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
      <h3 class="font-bold text-xl text-neutral-900 mb-2">❓ Preguntas Frecuentes</h3>
      <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
          <span>¿Cómo copiar emojis de iPhone en Android?</span>
          <span class="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <p class="mt-3 text-neutral-600 text-sm leading-relaxed">Toca o haz clic en cualquier emoji de Apple de esta página y se copiará automáticamente en tu portapapeles. Luego abre WhatsApp o Instagram y selecciona Pegar.</p>
      </details>
      <details class="group p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <summary class="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center">
          <span>¿Por qué los emojis de iPhone se ven diferentes en WhatsApp?</span>
          <span class="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <p class="mt-3 text-neutral-600 text-sm leading-relaxed">WhatsApp utiliza el conjunto oficial de emojis con diseño similar al de Apple en todas sus plataformas. Por lo tanto, cualquier emoji que copies aquí se verá idéntico al de un iPhone en tus conversaciones.</p>
      </details>
    </div>
  </main>

  <script>
    function showGeoToast(msg) {{
      var toast = document.getElementById('geo-toast');
      var toastMsg = document.getElementById('geo-toast-msg');
      toastMsg.innerText = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(function() {{
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }}, 2000);
    }}
  </script>

  {footer_html}
</body>
</html>
"""
    with open(os.path.join(es_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(es_html)

if __name__ == "__main__":
    generate_pages()

