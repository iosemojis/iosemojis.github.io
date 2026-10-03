import json
import os

new_categories = [
  {
    "slug": "aesthetic-emojis",
    "name": "Aesthetic Emojis",
    "icon": "🫧",
    "isConventional": False,
    "h1": "Aesthetic Emojis & Soft Symbols: Copy & Paste for Bios",
    "description": "Trending aesthetic emojis for Instagram bios, TikTok captions, and Discord. Soft girl, dark academia, vintage, and dreamy pastel symbols with 1-click copy.",
    "introCopy": "Elevate your digital presence with soft aesthetic symbols, dreamy pastels, and vintage motifs. Whether curating an Instagram bio, designing a Notion dashboard, or texting subtle vibes, copy aesthetic emojis instantly.",
    "curated_emojis": ["🫧", "🤍", "✨", "🧸", "🩰", "🕯️", "🕊️", "🪞", "🎧", "🍵", "🌸", "☁️", "🪽", "🍰", "🥀", "🌙", "🏹", "🪐", "💌", "🌾", "📖", "🗝️", "🪻", "🪷", "🪶", "🦢", "☕", "🥐", "🍓", "🎀", "🪄", "💿", "📼", "📻", "🎞️", "📷", "📜", "🎐"],
    "faqs": [
      {
        "question": "What are the most popular aesthetic emoji combinations for Instagram bios?",
        "answer": "Top combinations include 🫧🤍✨ (soft clean aesthetic), 🧸🎀🩰 (coquette / balletcore), 🌿🍵🕯️ (cottagecore / cozy study), and 🎧🖤🦇 (dark academia)."
      },
      {
        "question": "How do I make my texts and social profiles look aesthetic?",
        "answer": "Pair muted, elegant emojis (like 🤍 white heart, 🫧 bubbles, 🕊️ dove, and 🕯️ candle) with minimalist spacing and lowercase text."
      }
    ]
  },
  {
    "slug": "gaming-streaming",
    "name": "Gaming & Streaming",
    "icon": "🎮",
    "isConventional": False,
    "h1": "Gaming & Esports Emojis: Video Games, Discord & Twitch",
    "description": "Copy gaming emojis for Discord servers, Twitch streams, and gamer tags. Video game controllers, arcade monsters, trophies, headsets, and dice.",
    "introCopy": "Power up your gamer profile and live streams. From classic arcade joysticks and 8-bit alien monsters to esports championship trophies and gaming headsets, find all video game symbols with Unicode accuracy.",
    "curated_emojis": ["🎮", "🕹️", "👾", "🎯", "🎲", "🏆", "🥇", "🎧", "💻", "⚔️", "🛡️", "🃏", "💥", "🤖", "🧩", "♟️", "🎳", "🥊", "🪙", "💎", "👑", "🔥", "⚡", "🏹", "🗡️", "🧨", "💣", "🧙", "🐉", "🦖", "🪓", "🏰"],
    "faqs": [
      {
        "question": "Which emojis are best for Discord server roles and channel names?",
        "answer": "🎮 (General Gaming), 👾 (Retro Arcade), 🏆 (Tournaments/Leaderboards), 💬 (Chat), 📢 (Announcements), and 🎙️ (Voice Chat)."
      },
      {
        "question": "What is the official Unicode name for 🎮?",
        "answer": "It is officially cataloged as 'VIDEO GAME' in the Unicode Character Database."
      }
    ]
  },
  {
    "slug": "music-audio",
    "name": "Music & Audio",
    "icon": "🎵",
    "isConventional": False,
    "h1": "Music & Audio Emojis: Instruments, Concerts & Playlists",
    "description": "Copy musical notes, band instruments, DJ headphones, microphones, and concert emojis in 1 click for playlist titles and Spotify bios.",
    "introCopy": "Set the tone with musical notes, rhythm symbols, and instruments. Whether titling a Spotify playlist, sharing concert memories, or tuning your bio, inspect developer codes and copy music emojis in one tap.",
    "curated_emojis": ["🎵", "🎶", "🎧", "🎤", "🎸", "🎹", "🥁", "🎷", "🎺", "🎻", "📻", "🎙️", "🔊", "🎼", "🪗", "🪕", "🪘", "📣", "📢", "🎚️", "🎛️", "💿", "📀", "🪩", "🔔", "🔕", "🔈", "🔉", "🔇", "🧑‍🎤", "👩‍🎤", "👨‍🎤"],
    "faqs": [
      {
        "question": "What emojis work best for Spotify playlist covers and titles?",
        "answer": "🎧 (Chill / Lofi), 🎸 (Rock / Indie), 🎹 (Piano / Classical), 🪩 (Disco / Dance Party), and 🎶 (General Music Hits)."
      },
      {
        "question": "What is the difference between 🎵 and 🎶?",
        "answer": "🎵 represents a single eighth note (musical note), while 🎶 represents multiple beamed eighth notes (musical notes), often used to suggest singing, dancing, or upbeat melody."
      }
    ]
  },
  {
    "slug": "fashion-beauty",
    "name": "Fashion & Beauty",
    "icon": "💄",
    "isConventional": False,
    "h1": "Fashion & Beauty Emojis: Makeup, Nails, Clothes & Jewelry",
    "description": "Browse and copy chic fashion emojis, lipstick, nail polish, dresses, designer heels, sparkling diamonds, and aesthetic jewelry for outfit captions.",
    "introCopy": "Show off your style. From classic red lipstick (💄) and dramatic nail painting (💅) to couture dresses (👗) and sparkling gems (💎), discover high-fashion symbols for OOTD posts and beauty tutorials.",
    "curated_emojis": ["💄", "💅", "👗", "👠", "💍", "👑", "👛", "👒", "🕶️", "🛍️", "🪞", "🎀", "💎", "👢", "👡", "👙", "👘", "🥻", "🧣", "🧤", "🧥", "🦺", "👝", "👜", "🎒", "🧳", "🥿", "🩰", "🩱", "🩲", "🩳", "🪮", "💈", "🧴", "🧵", "🪡"],
    "faqs": [
      {
        "question": "What does the 💅 nail polish emoji mean in slang?",
        "answer": "Beyond cosmetics, 💅 is widely used as an attitude symbol signaling effortless confidence, nonchalance, 'spilling tea', or 'I said what I said'."
      },
      {
        "question": "Which emojis are most popular for OOTD (Outfit of the Day) captions?",
        "answer": "Top OOTD emojis include 👗, 👠, 🕶️, 👜, 🪞, and ✨."
      }
    ]
  },
  {
    "slug": "money-crypto",
    "name": "Money & Crypto",
    "icon": "💰",
    "isConventional": False,
    "h1": "Money, Wealth & Crypto Emojis: Cash, Stocks & Rich Symbols",
    "description": "Copy money bag, dollar banknotes, crypto coin, stock market charts, and credit card emojis. High-intent financial symbols for trading and wealth posts.",
    "introCopy": "Secure the bag. From overflowing money bags (💰) and soaring green upward stock charts (📈) to gold coins (🪙) and credit cards (💳), inspect symbols representing business success, wealth creation, and finance.",
    "curated_emojis": ["💰", "💵", "💸", "💳", "🤑", "📈", "📉", "💎", "🏦", "🪙", "📊", "💹", "🧾", "💶", "💷", "💴", "🏧", "🏷️", "💼", "🏢", "💲", "⚖️", "🗝️", "🔐", "🔒", "📦"],
    "faqs": [
      {
        "question": "What does the 🤑 Money-Mouth Face mean?",
        "answer": "It conveys excitement about making money, striking a lucrative business deal, feeling rich, or winning a jackpot."
      },
      {
        "question": "Is there an official Bitcoin or Cryptocurrency emoji?",
        "answer": "While Bitcoin has a dedicated Unicode currency symbol (₿, U+20BF), users commonly use 🪙 (Coin), 💎 (Diamond hands), and 🚀 (Rocket / to the moon) for crypto."
      }
    ]
  },
  {
    "slug": "horror-spooky",
    "name": "Spooky & Horror",
    "icon": "🎃",
    "isConventional": False,
    "h1": "Spooky & Halloween Emojis: Ghosts, Skulls, Bats & Horror",
    "description": "Scary and spooky emojis for Halloween, horror aesthetics, and gothic texting. Copy pumpkins, ghosts, skulls, bats, vampires, and zombies.",
    "introCopy": "Enter the shadows. Explore spooky jack-o'-lanterns (🎃), playful ghosts (👻), flying bats (🦇), and gothic skulls (💀) designed for Halloween celebrations, horror movie nights, and dark aesthetic profiles.",
    "curated_emojis": ["🎃", "👻", "💀", "☠️", "🦇", "🕷️", "🕸️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🩸", "🗡️", "🕯️", "🌑", "⚰️", "🪦", "🔮", "👺", "👹", "🔪", "🥀", "⛓️", "🪓", "👁️‍🗨️", "🖤", "🏚️"],
    "faqs": [
      {
        "question": "What is the best emoji combination for Halloween?",
        "answer": "Popular combos include 🎃👻🕷️ (Classic Spooky), 💀🦇⚰️ (Gothic Vampire), and 🧙‍♀️🔮🕯️ (Witchcraft / Magic)."
      },
      {
        "question": "Why do people use 👻 outside of Halloween?",
        "answer": "In modern dating culture, 👻 is also used playfully or critically to refer to 'ghosting'—suddenly cutting off communication."
      }
    ]
  },
  {
    "slug": "cute-kawaii",
    "name": "Cute & Kawaii",
    "icon": "🥺",
    "isConventional": False,
    "h1": "Cute & Kawaii Emojis: Sweet Faces, Soft Animals & Pastel",
    "description": "The cutest Japanese kawaii emojis and soft aesthetic symbols. Copy pleading faces, cute bunnies, kittens, strawberries, candy, and pink bows.",
    "introCopy": "Spread sweetness and joy. From the puppy-eyed pleading face (🥺) and cuddly teddy bears (🧸) to sweet strawberries (🍓) and pastel ribbons (🎀), explore the softest kawaii symbols for affectionate messages.",
    "curated_emojis": ["🥺", "🥹", "🐱", "🐰", "🌸", "🍓", "🍭", "🎀", "🧸", "🍰", "🍼", "🧁", "🐥", "💖", "🍩", "🍧", "🍡", "🐣", "🐶", "🦄", "🌈", "🍬", "🧋", "🥞", "🐾", "🐻", "🐼", "🐨", "🦋", "💐", "🌷", "🪻", "🪷", "🫧", "✨", "🤍", "🩷"],
    "faqs": [
      {
        "question": "What makes an emoji 'Kawaii'?",
        "answer": "Kawaii is the Japanese culture of cuteness, characterized by innocence, soft pastel colors, oversized eyes, and charming animal or dessert motifs."
      },
      {
        "question": "Which cute emojis are most popular for texting someone you like?",
        "answer": "🥺 (Pleading / Puppy eyes), 🧸 (Teddy bear), 🎀 (Pink bow), 🥹 (Touched / Emotional), and 🌸 (Cherry blossom)."
      }
    ]
  },
  {
    "slug": "gym-fitness",
    "name": "Gym & Fitness",
    "icon": "💪",
    "isConventional": False,
    "h1": "Gym & Workout Emojis: Fitness, Muscle, Lifting & Running",
    "description": "High-energy workout emojis for gym motivation, fitness tracking, and bodybuilding. Copy flexed biceps, barbell weightlifting, runners, and medals.",
    "introCopy": "Fuel your discipline and fitness milestones. From the classic flexed bicep (💪) and heavyweight barbells (🏋️) to mindful yoga (🧘) and marathon runners (🏃), find all athletic emojis to track your workout progress.",
    "curated_emojis": ["💪", "🏋️", "🏋️‍♂️", "🏋️‍♀️", "🏃", "🏃‍♂️", "🏃‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🥊", "🚴", "🚴‍♂️", "🚴‍♀️", "🥗", "🥇", "💧", "🏆", "🤸", "🤸‍♂️", "🤸‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🏊", "🏊‍♂️", "🏊‍♀️", "🎽", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️"],
    "faqs": [
      {
        "question": "What does the 💪 Flexed Bicep emoji represent?",
        "answer": "It represents physical strength, gym workouts, bodybuilding, perseverance, and emotional encouragement ('Stay strong!')."
      },
      {
        "question": "Which emojis are best for gym motivation captions?",
        "answer": "Top combinations include 💪🔥 (Strength + Grind), 🏋️‍♂️⏱️ (Heavy Lifting), and 🏃💨 (Cardio / Speed)."
      }
    ]
  }
]

cat_file = os.path.join("data", "categories.json")
with open(cat_file, "r", encoding="utf-8") as f:
    existing = json.load(f)

existing_slugs = {c["slug"] for c in existing}
added = 0
for cat in new_categories:
    if cat["slug"] not in existing_slugs:
        existing.append(cat)
        added += 1

with open(cat_file, "w", encoding="utf-8") as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print(f"Successfully added {added} new categories. Total categories: {len(existing)}")
