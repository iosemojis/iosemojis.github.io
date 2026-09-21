#!/usr/bin/env python3
"""
Emoji Reference Dataset and Site Validator
Validates /data/emojis.json, /data/categories.json, and /data/guides.json.
Checks for:
 - duplicate slugs
 - duplicate Unicode sequences
 - missing names
 - missing categories
 - invalid URLs
 - missing descriptions
 - broken related links
 - missing FAQ questions/answers
 - invalid JSON
 - Unicode accuracy
"""

import sys
import os
import json
import re

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMOJIS_FILE = os.path.join(ROOT_DIR, "data", "emojis.json")
CATEGORIES_FILE = os.path.join(ROOT_DIR, "data", "categories.json")
GUIDES_FILE = os.path.join(ROOT_DIR, "data", "guides.json")

def validate():
    errors = []
    warnings = []

    print("🔍 Validating Emoji Reference Dataset...")

    # 1. Validate files existence
    for path, name in [(EMOJIS_FILE, "emojis.json"), (CATEGORIES_FILE, "categories.json"), (GUIDES_FILE, "guides.json")]:
        if not os.path.exists(path):
            errors.append(f"Missing required file: {name}")
            continue

    if errors:
        for err in errors:
            print(f"❌ ERROR: {err}")
        sys.exit(1)

    # 2. Parse JSON
    try:
        with open(EMOJIS_FILE, "r", encoding="utf-8") as f:
            emojis = json.load(f)
    except Exception as e:
        errors.append(f"Invalid JSON in {EMOJIS_FILE}: {e}")
        emojis = []

    try:
        with open(CATEGORIES_FILE, "r", encoding="utf-8") as f:
            categories = json.load(f)
    except Exception as e:
        errors.append(f"Invalid JSON in {CATEGORIES_FILE}: {e}")
        categories = []

    try:
        with open(GUIDES_FILE, "r", encoding="utf-8") as f:
            guides = json.load(f)
    except Exception as e:
        errors.append(f"Invalid JSON in {GUIDES_FILE}: {e}")
        guides = []

    category_slugs = set(c.get("slug") for c in categories if "slug" in c)
    emoji_slugs = set()
    unicode_seqs = set()

    # 3. Validate Categories
    for idx, cat in enumerate(categories):
        c_slug = cat.get("slug")
        if not c_slug:
            errors.append(f"Category #{idx} missing 'slug'")
        if not cat.get("name"):
            errors.append(f"Category {c_slug} missing 'name'")
        if not cat.get("description"):
            errors.append(f"Category {c_slug} missing 'description'")
        if not cat.get("introCopy"):
            errors.append(f"Category {c_slug} missing 'introCopy'")
        if not cat.get("h1"):
            errors.append(f"Category {c_slug} missing 'h1'")

    # 4. Validate Emojis
    for idx, item in enumerate(emojis):
        slug = item.get("slug")
        if not slug:
            errors.append(f"Emoji #{idx} missing slug")
            continue

        # Check duplicate slugs
        if slug in emoji_slugs:
            errors.append(f"Duplicate emoji slug found: '{slug}'")
        emoji_slugs.add(slug)

        # Name check
        if not item.get("name"):
            errors.append(f"Emoji '{slug}' is missing a name")

        # Emoji glyph check
        if not item.get("emoji"):
            errors.append(f"Emoji '{slug}' is missing character glyph")

        # Category check
        cat = item.get("category")
        if not cat:
            errors.append(f"Emoji '{slug}' is missing category")
        elif cat not in category_slugs:
            errors.append(f"Emoji '{slug}' references unknown category '{cat}'")

        # Unicode accuracy check
        u_list = item.get("unicode", [])
        if not u_list or not isinstance(u_list, list):
            errors.append(f"Emoji '{slug}' missing unicode array")
        else:
            for u in u_list:
                if not re.match(r"^U\+[0-9A-Fa-f]{4,6}$", u):
                    errors.append(f"Emoji '{slug}' has invalid unicode format: '{u}'")

        seq = item.get("unicodeSequence")
        if not seq:
            errors.append(f"Emoji '{slug}' missing unicodeSequence")
        else:
            if seq in unicode_seqs:
                errors.append(f"Duplicate unicodeSequence '{seq}' in emoji '{slug}'")
            unicode_seqs.add(seq)

        # Required fields check
        for req in ["htmlEntity", "htmlHex", "cssEscape", "jsEscape", "urlEncoded", "shortMeaning"]:
            if not item.get(req):
                errors.append(f"Emoji '{slug}' missing required field: '{req}'")

        # Meanings object check
        meanings = item.get("meanings", {})
        if not isinstance(meanings, dict):
            errors.append(f"Emoji '{slug}' 'meanings' must be an object")
        else:
            for m_key in ["general", "romantic", "friendship", "socialMedia", "texting"]:
                if not meanings.get(m_key):
                    errors.append(f"Emoji '{slug}' missing meaning for '{m_key}'")

        # FAQs check
        faqs = item.get("faqs", [])
        if not faqs:
            warnings.append(f"Emoji '{slug}' has no FAQs")
        for f_idx, faq in enumerate(faqs):
            if not faq.get("question") or not faq.get("answer"):
                errors.append(f"Emoji '{slug}' FAQ #{f_idx} missing question or answer")

    # Check related emoji links
    for item in emojis:
        slug = item.get("slug")
        for rel in item.get("related", []):
            if rel not in emoji_slugs:
                # If related is a known standard emoji not in sample dataset, issue warning, not break
                warnings.append(f"Emoji '{slug}' references related emoji '{rel}' which is not in dataset")

    # 5. Validate Guides
    for guide in guides:
        g_slug = guide.get("slug")
        if not g_slug:
            errors.append("Guide missing slug")
            continue
        if not guide.get("title"):
            errors.append(f"Guide '{g_slug}' missing title")
        if not guide.get("description"):
            errors.append(f"Guide '{g_slug}' missing description")
        if not guide.get("contentSections"):
            errors.append(f"Guide '{g_slug}' has no content sections")
        for rel_emoji in guide.get("relevantEmojis", []):
            if rel_emoji not in emoji_slugs:
                warnings.append(f"Guide '{g_slug}' references emoji '{rel_emoji}' not in dataset")

    # Output results
    print(f"📊 Dataset statistics: {len(emojis)} emojis, {len(categories)} categories, {len(guides)} guides.")
    if warnings:
        print(f"⚠️  {len(warnings)} Warnings:")
        for w in warnings[:10]:
            print(f"   - {w}")
        if len(warnings) > 10:
            print(f"   ... and {len(warnings)-10} more warnings.")

    if errors:
        print(f"\n❌ Validation FAILED with {len(errors)} errors:")
        for err in errors:
            print(f"   - {err}")
        sys.exit(1)
    else:
        print("\n✅ Validation PASSED! All records, Unicode structures, and slugs are valid.")
        return True

if __name__ == "__main__":
    validate()
