#!/usr/bin/env python3
"""
iOS Emoji Facebook Auto-Poster
Automatically generates a 1080x1080 social card with authentic Apple emoji artwork,
crafts viral captions with targeted hashtags, and publishes to Facebook Page via Meta Graph API.
"""

import os
import sys
import json
import random
import argparse
import urllib.request
import urllib.parse
from datetime import datetime

# Ensure utf-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT_DIR = os.path.join(ROOT_DIR, "public", "assets", "social")
HISTORY_FILE = os.path.join(DATA_DIR, "facebook_history.json")

# Category-specific viral hashtag mapping
CATEGORY_HASHTAGS = {
    "hearts-love": ["#LoveEmoji", "#HeartEmojis", "#RomanticText", "#AestheticHearts", "#DatingVibes"],
    "smileys-emotions": ["#MoodEmoji", "#ReactionEmoji", "#Smileys", "#FacialExpression", "#Relatable"],
    "viral-emojis": ["#TrendingNow", "#ViralEmoji", "#TikTokEmoji", "#GenZSlang", "#TrendingEmojis"],
    "festivals-holidays": ["#FestiveVibes", "#HolidayEmoji", "#CelebrationEmojis", "#Festivals"],
    "religion-spirituality": ["#SpiritualSymbols", "#FaithAndPeace", "#SacredSymbols"],
    "food-drinks": ["#Foodie", "#FoodEmoji", "#Yum", "#SnackTime"],
    "animals-nature": ["#NatureEmoji", "#CuteAnimals", "#Wildlife", "#PetLovers"],
    "activities-sports": ["#SportsVibes", "#WorkoutMotivation", "#GameTime"],
    "travel-places": ["#Wanderlust", "#TravelVibes", "#VacationMood", "#Explore"],
    "objects-tech": ["#TechLife", "#AppleEcosystem", "#DigitalArt"],
    "symbols-zodiac": ["#ZodiacSigns", "#AstrologyVibes", "#Symbols"],
}

CORE_HASHTAGS = [
    "#iPhoneEmoji", "#AppleEmoji", "#iOSEmoji", "#iOSKeyboard",
    "#WhatsAppEmoji", "#EmotiPhone", "#AppleStickers", "#AestheticEmojis",
    "#EmojiMeaning", "#CopyEmoji"
]

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_font(size, bold=False):
    font_candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFProText-Bold.ttf" if bold else "/System/Library/Fonts/SFProText-Regular.ttf",
    ]
    for path in font_candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    try:
        return ImageFont.load_default()
    except Exception:
        return None

def fetch_apple_emoji_image(unicode_seq):
    """Fetches official 160px Apple emoji PNG from high-res repository."""
    urls = [
        f"https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-160/{unicode_seq}.png",
        f"https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/{unicode_seq}.png",
    ]
    for url in urls:
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) iOS Emoji Social Generator"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    from io import BytesIO
                    return Image.open(BytesIO(resp.read())).convert("RGBA")
        except Exception as e:
            continue
    return None

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        w = bbox[2] - bbox[0]
        if w <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def generate_social_card(emoji_data, output_path):
    """Generates a premium 1080x1080 Instagram/Facebook card."""
    width, height = 1080, 1080
    im = Image.new("RGBA", (width, height), (15, 23, 42, 255)) # Slate-900
    draw = ImageDraw.Draw(im)

    # Gradient subtle background simulation
    for y in range(height):
        ratio = y / height
        r = int(15 * (1 - ratio) + 11 * ratio)
        g = int(23 * (1 - ratio) + 15 * ratio)
        b = int(42 * (1 - ratio) + 25 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # Inner Glow Card
    card_margin = 48
    card_rect = [card_margin, card_margin, width - card_margin, height - card_margin]
    draw.rounded_rectangle(card_rect, radius=36, fill=(30, 41, 59, 255), outline=(71, 85, 105, 180), width=3)

    # Top Pill Header
    pill_w, pill_h = 420, 52
    pill_x0 = (width - pill_w) // 2
    pill_y0 = card_margin + 44
    draw.rounded_rectangle([pill_x0, pill_y0, pill_x0 + pill_w, pill_y0 + pill_h], radius=26, fill=(15, 23, 42, 220), outline=(59, 130, 246, 200), width=2)

    font_pill = get_font(20, bold=True)
    draw.text((pill_x0 + 28, pill_y0 + 14), "🍎  APPLE EMOJI OF THE DAY", fill=(147, 197, 253, 255), font=font_pill)

    # Fetch Emoji Image
    unicode_seq = emoji_data.get("unicodeSequence", "1f600")
    emoji_img = fetch_apple_emoji_image(unicode_seq)
    emoji_box_y = 170

    if emoji_img:
        # Resize with high quality Lanczos
        target_size = 320
        emoji_img = emoji_img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        emoji_x = (width - target_size) // 2
        emoji_y = emoji_box_y

        # Soft shadow under emoji
        shadow = Image.new("RGBA", (target_size + 40, target_size + 40), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow)
        s_draw.ellipse([20, 20, target_size + 20, target_size + 20], fill=(0, 0, 0, 80))
        shadow = shadow.filter(ImageFilter.GaussianBlur(16))
        im.paste(shadow, (emoji_x - 20, emoji_y - 10), shadow)

        # Paste Emoji
        im.paste(emoji_img, (emoji_x, emoji_y), emoji_img)
    else:
        # Fallback text glyph
        font_big = get_font(180, bold=True)
        draw.text((width // 2 - 90, emoji_box_y + 40), emoji_data["emoji"], fill=(255, 255, 255, 255), font=font_big)

    # Emoji Name
    name_text = emoji_data["name"]
    font_name = get_font(52, bold=True)
    name_bbox = draw.textbbox((0, 0), name_text, font=font_name)
    name_w = name_bbox[2] - name_bbox[0]
    draw.text(((width - name_w) // 2, 530), name_text, fill=(255, 255, 255, 255), font=font_name)

    # Subheading: Category & Unicode
    unicode_str = " ".join(emoji_data.get("unicode", []))
    cat_name = emoji_data.get("category", "").replace("-", " ").title()
    sub_text = f"{cat_name}  •  {unicode_str}"
    font_sub = get_font(24, bold=False)
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((width - sub_w) // 2, 600), sub_text, fill=(148, 163, 184, 255), font=font_sub)

    # Meaning Box
    meaning_box = [card_margin + 44, 650, width - card_margin - 44, 880]
    draw.rounded_rectangle(meaning_box, radius=24, fill=(15, 23, 42, 220), outline=(51, 65, 85, 200), width=2)

    font_meaning_title = get_font(22, bold=True)
    draw.text((meaning_box[0] + 32, meaning_box[1] + 24), "💡  Official Meaning & Texting Vibe:", fill=(96, 165, 250, 255), font=font_meaning_title)

    font_meaning_body = get_font(26, bold=False)
    meaning_text = emoji_data.get("shortMeaning", "")
    lines = wrap_text(meaning_text, font_meaning_body, meaning_box[2] - meaning_box[0] - 64, draw)
    text_y = meaning_box[1] + 70
    for line in lines[:3]:
        draw.text((meaning_box[0] + 32, text_y), line, fill=(226, 232, 240, 255), font=font_meaning_body)
        text_y += 38

    # Bottom Branding Bar
    footer_text = "🌐  iosemojis.github.io  •  Tap to Copy 1-Click for WhatsApp & Instagram"
    font_footer = get_font(22, bold=True)
    f_bbox = draw.textbbox((0, 0), footer_text, font=font_footer)
    f_w = f_bbox[2] - f_bbox[0]
    draw.text(((width - f_w) // 2, 935), footer_text, fill=(147, 197, 253, 255), font=font_footer)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    # Save as high quality PNG
    im.convert("RGB").save(output_path, "PNG", quality=95)
    print(f"✅ Generated social card at: {output_path}")

def build_post_content(emoji_data):
    cat_slug = emoji_data.get("category", "")
    specific_tags = CATEGORY_HASHTAGS.get(cat_slug, ["#Emoji", "#Symbols"])
    all_hashtags = specific_tags + CORE_HASHTAGS
    hashtags_str = " ".join(all_hashtags)

    meanings = emoji_data.get("meanings", {})
    general_meaning = meanings.get("general", emoji_data.get("shortMeaning", ""))
    romantic_meaning = meanings.get("romantic", "")

    context_section = f"💬 Best for texting:\n{general_meaning}"
    if romantic_meaning and "love" in cat_slug:
        context_section += f"\n❤️ Romantic vibe: {romantic_meaning}"

    caption = f"""✨ Apple Emoji of the Day: {emoji_data['emoji']} {emoji_data['name']}

📖 What it means:
{emoji_data.get('shortMeaning', '')}

{context_section}

📲 How to use:
Tap the link below to copy this authentic Apple iOS emoji with 1 click to your clipboard. It renders beautifully across iPhone, Android, WhatsApp, and Instagram!

🔗 Direct Copy & Info:
https://iosemojis.github.io/emoji/{emoji_data['slug']}/

.
.
{hashtags_str}
"""
    return caption.strip()

def post_to_facebook(page_id, page_access_token, image_path, caption, emoji_slug):
    """Publishes photo + caption to Facebook Page via Meta Graph API."""
    url = f"https://graph.facebook.com/v19.0/{page_id}/photos"

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    boundary = "----WebKitFormBoundary" + "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=16))
    body = bytearray()

    # caption
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(b'Content-Disposition: form-data; name="caption"\r\n\r\n')
    body.extend(caption.encode("utf-8"))
    body.extend(b"\r\n")

    # access_token
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(b'Content-Disposition: form-data; name="access_token"\r\n\r\n')
    body.extend(page_access_token.encode("utf-8"))
    body.extend(b"\r\n")

    # source (image file)
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(b'Content-Disposition: form-data; name="source"; filename="emoji.png"\r\n')
    body.extend(b"Content-Type: image/png\r\n\r\n")
    body.extend(image_bytes)
    body.extend(b"\r\n")

    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            post_id = data.get("id") or data.get("post_id")
            print(f"🎉 Successfully posted to Facebook! Post ID: {post_id}")

            # Try posting a first comment with the link to boost algorithm reach
            if post_id:
                try:
                    comment_url = f"https://graph.facebook.com/v19.0/{post_id}/comments"
                    comment_msg = f"👉 Copy {emoji_slug} with 1 click directly to your clipboard: https://iosemojis.github.io/emoji/{emoji_slug}/"
                    comment_data = urllib.parse.urlencode({
                        "message": comment_msg,
                        "access_token": page_access_token
                    }).encode("utf-8")
                    comment_req = urllib.request.Request(comment_url, data=comment_data)
                    with urllib.request.urlopen(comment_req) as c_resp:
                        print("💬 1st comment posted successfully!")
                except Exception as c_err:
                    print(f"Note on 1st comment: {c_err}")

            return data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Facebook Graph API Error ({e.code}): {error_body}")
        raise

def main():
    parser = argparse.ArgumentParser(description="iOS Emoji Facebook Auto-Poster")
    parser.add_argument("--slug", help="Specific emoji slug to post")
    parser.add_argument("--dry-run", action="store_true", help="Generate card and caption without publishing to Facebook")
    args = parser.parse_args()

    emojis = load_json(os.path.join(DATA_DIR, "emojis.json"))

    # Load history
    history = []
    if os.path.exists(HISTORY_FILE):
        try:
            history = load_json(HISTORY_FILE)
        except Exception:
            history = []
    posted_slugs = set(history)

    # Pick emoji
    target_emoji = None
    if args.slug:
        for emo in emojis:
            if emo["slug"] == args.slug:
                target_emoji = emo
                break
    else:
        # Prioritize viral, love, or popular emojis that haven't been posted yet
        high_priority = [e for e in emojis if e["slug"] not in posted_slugs and e.get("category") in ["hearts-love", "viral-emojis", "smileys-emotions"]]
        candidates = high_priority if high_priority else [e for e in emojis if e["slug"] not in posted_slugs]
        
        if not candidates:
            print("All emojis have been posted! Resetting cycle...")
            candidates = emojis
            posted_slugs.clear()

        target_emoji = random.choice(candidates)

    if not target_emoji:
        print("No emoji selected!")
        sys.exit(1)

    print(f"Selected Emoji: {target_emoji['emoji']} {target_emoji['name']} ({target_emoji['slug']})")

    # Generate Card
    card_path = os.path.join(OUTPUT_DIR, f"{target_emoji['slug']}.png")
    generate_social_card(target_emoji, card_path)

    # Build Caption
    caption = build_post_content(target_emoji)
    print("\n--- Generated Caption ---")
    print(caption)
    print("-------------------------\n")

    page_id = os.environ.get("FB_PAGE_ID")
    page_token = os.environ.get("FB_PAGE_ACCESS_TOKEN")

    if args.dry_run or not page_id or not page_token:
        print("ℹ️ Dry-run mode or Meta credentials not set. Skipping Facebook API call.")
        print("Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN environment variables to post live.")
        return

    # Post to Facebook
    post_to_facebook(page_id, page_token, card_path, caption, target_emoji["slug"])

    # Update history
    if target_emoji["slug"] not in posted_slugs:
        history.append(target_emoji["slug"])
        save_json(HISTORY_FILE, history)
        print(f"Saved to post history ({len(history)} total).")

if __name__ == "__main__":
    main()
