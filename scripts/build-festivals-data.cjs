const fs = require('fs');
const path = require('path');

const emojis = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/emojis.json'), 'utf8'));
const emojiByGlyph = new Map(emojis.map(e => [e.emoji, e]));

function getSlugsForGlyphs(glyphs) {
  const slugs = [];
  glyphs.forEach(g => {
    // Try exact or without variation selector
    let e = emojiByGlyph.get(g);
    if (!e && g.endsWith('\uFE0F')) {
      e = emojiByGlyph.get(g.replace(/\uFE0F$/, ''));
    }
    if (!e) {
      e = emojiByGlyph.get(g + '\uFE0F');
    }
    if (e) {
      slugs.push(e.slug);
    } else {
      console.warn('Glyph not found in emojis.json:', g);
    }
  });
  return slugs;
}

const FESTIVALS_RAW = [
  {
    slug: 'diwali',
    name: 'Diwali (Deepavali)',
    tagline: 'The Sacred Festival of Lights, Prosperity & Triumph of Good',
    icon: '🪔',
    seasonOrDate: 'October / November (Kartik Amavasya)',
    region: 'India, South Asia & Global Hindu, Sikh, Jain Communities',
    h1: 'Diwali Emojis & Deepavali Wishes: Copy 🪔, Quotes & Meanings',
    description: 'Explore and copy official Diwali emojis including the Diya Lamp 🪔, fireworks 🎆, sparklers 🎇, and sweet treats. Ready-made WhatsApp greetings and Instagram captions.',
    culturalSignificance: 'Diwali (or Deepavali, "row of lighted lamps") is one of the most widely celebrated festivals across India and the global South Asian diaspora. Celebrated over five days, it honors the return of Lord Rama to Ayodhya after 14 years of exile, the blessings of Goddess Lakshmi (wealth and prosperity), and Lord Krishna defeating Narakasura. Homes are thoroughly cleaned, adorned with colorful rangoli patterns at entryways, illuminated with clay diya lamps, and filled with sweet delicacies (mithai) shared among loved ones.',
    traditions: [
      'Lighting rows of earthenware clay diya lamps with cotton wicks and mustard/sesame oil',
      'Creating intricate powdered rangoli art on doorsteps to welcome good fortune',
      'Performing Lakshmi Puja prayer ceremonies for abundance, health, and wisdom',
      'Exchanging sweets (mithai like kaju katli, ladoos, jalebi) and festive gift boxes with neighbors',
      'Wearing new traditional attire (saris, kurtas, lehengas) and lighting evening sparklers'
    ],
    glyphs: ['🪔', '✨', '🎆', '🎇', '🥻', '🍬', '🪙', '🥳', '🌕', '🕉️', '🧡', '🕯️', '🌸', '🪷', '🙏'],
    combos: [
      { combo: '🪔✨🎆🎇', label: 'Diwali Radiance', meaning: 'The quintessential celebration sequence representing oil lamps, holy light, and fireworks.' },
      { combo: '🪔🥻🍬🪙', label: 'Festive Lakshmi Blessings', meaning: 'Symbolizes spiritual lighting, traditional attire, festive sweets, and golden prosperity.' },
      { combo: '🙏🪔✨💖', label: 'Spiritual Diwali Gratitude', meaning: 'Reverence, holy light, divine presence, and affectionate warmth.' },
      { combo: '🪷🕉️🪔✨', label: 'Sacred Pooja Set', meaning: 'Lotus flower, sacred Om, earthen diya, and divine spiritual glow.' }
    ],
    greetings: [
      {
        title: 'Traditional Diwali Blessing',
        text: 'Wishing you and your family a luminous Diwali filled with love, laughter, and endless prosperity. May the divine light of the diya banish all darkness from your path! 🪔✨🎆',
        emojiCombo: '🪔✨🎆'
      },
      {
        title: 'Modern WhatsApp & SMS Wish',
        text: 'Happy Deepavali! May Goddess Lakshmi bless your home with peace, good health, wealth, and sweet moments with loved ones. 🪔🥻🍬🪙',
        emojiCombo: '🪔🥻🍬🪙'
      },
      {
        title: 'Instagram & Social Caption',
        text: 'May your year shine brighter than a thousand sparklers! Light over darkness, knowledge over ignorance. Shubh Deepavali! 🪔🎇✨💫',
        emojiCombo: '🪔🎇✨💫'
      },
      {
        title: 'Professional / Workplace Greeting',
        text: 'Wishing our esteemed colleagues and partners a joyful Diwali and a prosperous New Year filled with continued success and brilliant milestones. 🪔✨🤝',
        emojiCombo: '🪔✨🤝'
      }
    ],
    faqs: [
      {
        question: 'Which emoji is the official Diwali emoji?',
        answer: 'The Diya Lamp (🪔) was officially added to the Unicode Standard in Unicode 12.0 (2019) specifically to represent the traditional oil lamp lit during Diwali and Deepavali.'
      },
      {
        question: 'What emojis pair best with 🪔 for Diwali messages?',
        answer: 'Sparkles (✨), Fireworks (🎆), Sparkler (🎇), Sari (🥻), Candy/Sweet (🍬), Coin (🪙), and Folded Hands (🙏) create the most culturally resonant aesthetic combinations.'
      },
      {
        question: 'What is the correct greeting for Diwali?',
        answer: 'Common greetings include "Happy Diwali!", "Shubh Deepavali!" (Hindi/Sanskrit for Auspicious Diwali), or "Deepavali Valthukkal" (Tamil).'
      }
    ]
  },
  {
    slug: 'christmas',
    name: 'Christmas',
    tagline: 'Joyous Holiday Season, Family Gatherings & Peace on Earth',
    icon: '🎄',
    seasonOrDate: 'December 25 (Winter / Summer in Southern Hemisphere)',
    region: 'Worldwide',
    h1: 'Christmas Emojis & Holiday Wishes: Copy 🎄, Santa, Gifts & Codes',
    description: 'Copy authentic Christmas emojis including Christmas Tree 🎄, Santa Claus 🎅, gifts 🎁, snowflakes ❄️, and reindeer. Ready holiday greetings and status messages.',
    culturalSignificance: 'Christmas is an annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration among billions of people globally. Over centuries, Christmas has blended Christian traditions of the Nativity, carols, and midnight church services with joyous seasonal customs: decorating evergreen trees, hanging stockings by the fireplace, awaiting Santa Claus, sharing lavish feasts with family, and exchanging thoughtfully wrapped gifts.',
    traditions: [
      'Decorating evergreen coniferous Christmas trees with glowing lights, baubles, and angel/star toppers',
      'Singing timeless Christmas carols and attending candlelit Christmas Eve services',
      'Hanging festive knit stockings by the hearth for Saint Nicholas / Santa Claus',
      'Exchanging wrapped holiday presents around the Christmas tree on Christmas morning',
      'Baking gingerbread cookies, fruitcakes, and sharing roasted family dinners'
    ],
    glyphs: ['🎄', '🎅', '🤶', '🎁', '❄️', '⛄', '🦌', '🔔', '🕯️', '🍪', '🥛', '🌟', '🧦', '⛪', '🧑‍🎄'],
    combos: [
      { combo: '🎄🎅🎁❄️', label: 'Classic Christmas Eve', meaning: 'Tree, Santa, gifts, and falling winter snow.' },
      { combo: '🍪🥛🧦✨', label: 'Santa Treat Tray', meaning: 'Milk and cookies left out for Santa next to the warm stocking.' },
      { combo: '🦌🛷🎅⭐', label: 'Sleigh Ride Flight', meaning: 'Reindeer pulling Santa\'s sleigh under the glowing North Star.' },
      { combo: '🕯️⛪🔔🕊️', label: 'Holy Christmas Peace', meaning: 'Candlelight, cathedral service, church bells, and the dove of peace.' }
    ],
    greetings: [
      {
        title: 'Warm Family Holiday Blessing',
        text: 'Merry Christmas! May your home be blessed with cozy warmth, joyful laughter, and peace that lasts throughout the coming year. 🎄🎁❄️',
        emojiCombo: '🎄🎁❄️'
      },
      {
        title: 'Festive Santa & Treats Greeting',
        text: 'Wishing you a magical Christmas morning! May Santa bring you everything on your wishlist and more! 🎅✨🍪🎁',
        emojiCombo: '🎅✨🍪🎁'
      },
      {
        title: 'Short & Sweet Holiday Text',
        text: 'Merry Christmas & Happy Holidays to you and yours! Stay cozy and enjoy every moment. 🎄⛄❤️',
        emojiCombo: '🎄⛄❤️'
      },
      {
        title: 'Corporate / Professional Season\'s Greetings',
        text: 'Wishing you a joyful holiday season and a prosperous, healthy New Year. Thank you for wonderful collaboration this year! 🎄🌟🤝',
        emojiCombo: '🎄🌟🤝'
      }
    ],
    faqs: [
      {
        question: 'Which emojis are most popular for Christmas texting?',
        answer: 'Christmas Tree (🎄), Santa Claus (🎅), Wrapped Gift (🎁), Snowflake (❄️), Snowman (⛄), Bell (🔔), and Glowing Star (🌟).'
      },
      {
        question: 'Does Apple have unique Christmas emoji artwork?',
        answer: 'Yes, Apple renders the Christmas Tree with delicate glowing multicolor baubles, realistic pine needle texture, and a shining golden topper.'
      }
    ]
  },
  {
    slug: 'eid',
    name: 'Eid al-Fitr & Eid al-Adha',
    tagline: 'Sacred Celebrations of Gratitude, Charity & Unity',
    icon: '🌙',
    seasonOrDate: 'Islamic Lunar Months of Shawwal & Dhul Hijjah',
    region: 'Middle East, South & Southeast Asia, Africa & Global Islamic Communities',
    h1: 'Eid Mubarak Emojis: Crescent 🌙, Mosque 🕌, Wishes & Statuses',
    description: 'Discover and copy official Eid emojis including the Crescent Moon 🌙, Mosque 🕌, Folded Hands, and feasts. Ready-to-copy Eid Mubarak greetings and messages.',
    culturalSignificance: 'Islam celebrates two major joyous Eids: Eid al-Fitr ("Festival of Breaking the Fast"), marking the triumphant completion of the holy month of Ramadan, and Eid al-Adha ("Festival of the Sacrifice"), commemorating Prophet Ibrahim\'s devotion. Celebrations commence with congregational morning prayers (Salat al-Eid), donning fine new garments, distributing charity (Zakat al-Fitr), exchanging warm hugs of "Eid Mubarak", and feasting on fragrant biryani, sheer khurma, and sweet dates with loved ones.',
    traditions: [
      'Gathering for special congregational Eid prayers in open fields (Eidgah) or grand mosques',
      'Giving Zakat al-Fitr (obligatory charity) to ensure underprivileged families feast joyously',
      'Wearing new traditional garments (thobes, abayas, kurtas) and fragrant attar perfume',
      'Exchanging Eidi (monetary gifts and pocket money) with younger siblings and children',
      'Sharing sweet delicacies like sheer khurma, baklava, ma\'amoul, and slow-cooked festive feasts'
    ],
    glyphs: ['🌙', '⭐', '🕌', '🐑', '🤲', '🎁', '🍲', '🕋', '💚', '✨', '🫂', '🕊️', '📿', '🌴', '🤝'],
    combos: [
      { combo: '🌙⭐🕌✨', label: 'Eid Crescent Night', meaning: 'The new crescent moon marking the blessed arrival of Eid over the minarets.' },
      { combo: '🤲🕋💚🕊️', label: 'Devout Prayers & Blessings', meaning: 'Supplication palms, holy Kaaba, green faith heart, and peaceful dove.' },
      { combo: '🫂🎁🍲🎉', label: 'Eid Reunion & Feast', meaning: 'Warm embraces, gifts (Eidi), fragrant feast, and celebration.' },
      { combo: '🌙🐑✨🤲', label: 'Eid al-Adha Blessing', meaning: 'Sacrifice, charity, devotion, and gratitude.' }
    ],
    greetings: [
      {
        title: 'Classic Eid Mubarak Wish',
        text: 'Eid Mubarak! May Allah accept our good deeds, forgive our shortcomings, and shower your life with boundless peace, health, and happiness! 🌙🕌✨',
        emojiCombo: '🌙🕌✨'
      },
      {
        title: 'Family & Loved Ones Blessing',
        text: 'Kul \'am wa antum bi-khair! Wishing you and your beloved family a blessed Eid filled with togetherness, delicious feasts, and cherished moments. 🌙💚🤲',
        emojiCombo: '🌙💚🤲'
      },
      {
        title: 'Joyful Status & Caption',
        text: 'Eid greetings to all celebrating around the world! May our hearts be filled with compassion, gratitude, and joy today. Eid Mubarak! 🌙⭐🎉',
        emojiCombo: '🌙⭐🎉'
      },
      {
        title: 'Eid al-Adha Specific Greeting',
        text: 'Wishing you a blessed Eid al-Adha! May the spirit of sacrifice, faith, and charity inspire our days and strengthen our bonds. 🌙🐑🤲',
        emojiCombo: '🌙🐑🤲'
      }
    ],
    faqs: [
      {
        question: 'What emojis best represent Eid celebrations?',
        answer: 'Crescent Moon (🌙), Star (⭐), Mosque (🕌), Palms Up Together (🤲), Wrapped Gift (🎁), and Green Heart (💚).'
      },
      {
        question: 'What is the greeting phrase for Eid?',
        answer: '"Eid Mubarak" (Blessed Eid) or "Eid Saeed" (Happy Eid) are the most universal greetings used across Arabic, English, Urdu, Turkish, and Indonesian.'
      }
    ]
  },
  {
    slug: 'halloween',
    name: 'Halloween',
    tagline: 'Spooky Season, Costumes, Jack-o\'-Lanterns & Sweet Treats',
    icon: '🎃',
    seasonOrDate: 'October 31 (Autumn)',
    region: 'North America, Europe, East Asia & Worldwide',
    h1: 'Halloween Emojis: Pumpkin 🎃, Ghost 👻, Bats, Spooky Wishes & Codes',
    description: 'Explore and copy spooky Halloween emojis: Jack-o\'-Lantern 🎃, Ghost 👻, Bat 🦇, Spider Web 🕸️, and Candy. Ready-made spooky captions for Instagram and TikTok.',
    culturalSignificance: 'Originating from the ancient Celtic festival of Samhain, when people lit bonfires and wore disguises to ward off roaming spirits, modern Halloween has evolved into a fun, theatrical worldwide holiday. Celebrated on October 31, it features children trick-or-treating in creative costumes, carving toothy grimaces into hollow orange pumpkins (jack-o\'-lanterns), watching horror films, touring haunted houses, and enjoying candy apples and chocolate treats.',
    traditions: [
      'Carving intricate faces into fresh orange pumpkins illuminated by flickering tea candles',
      'Trick-or-treating around the neighborhood in costumes shouting "Trick or Treat!"',
      'Dressing up as supernatural beings (witches, ghosts, vampires) or pop culture icons',
      'Hosting spooky costume parties with themed treats, punch bowls, and cobweb decorations',
      'Telling ghost stories by campfire and watching classic scary movies'
    ],
    glyphs: ['🎃', '👻', '🦇', '🕸️', '🕷️', '🍬', '🧙', '🧛', '🧟', '💀', '🕯️', '🦉', '🐈‍⬛', '🌕', '🍭', '🍫'],
    combos: [
      { combo: '🎃👻🦇🕸️', label: 'The Haunted Night', meaning: 'The classic quartet of Halloween: carved pumpkin, wandering ghost, flying bat, and spiderweb.' },
      { combo: '🧙‍♀️🧹🌕🐈‍⬛', label: 'Witch on a Broomstick', meaning: 'Witch soaring across the full October moon with her black cat companion.' },
      { combo: '🍬🍭🍫😋', label: 'Trick-or-Treat Loot', meaning: 'The ultimate haul of candy, lollipops, and chocolates.' },
      { combo: '🧛‍♂️🩸🕯️🏰', label: 'Gothic Vampire Castle', meaning: 'Candlelit castle crypt with Dracula.' }
    ],
    greetings: [
      {
        title: 'Spooky & Playful Wish',
        text: 'Happy Halloween! Wishing you a spooktacular night filled with thrilling chills, killer costumes, and bags full of delicious candy! 🎃👻🍬',
        emojiCombo: '🎃👻🍬'
      },
      {
        title: 'Instagram Spooky Caption',
        text: 'Creep it real, witches! Tonight we carve pumpkins, howl at the moon, and eat all the candy corn. Happy Spooky Season! 🎃🦇✨',
        emojiCombo: '🎃🦇✨'
      },
      {
        title: 'Trick-or-Treat Greeting',
        text: 'Trick or treat, smell my feet, give me something good to eat! Have a safe, wicked, and super fun Halloween! 🎃🍭👻',
        emojiCombo: '🎃🍭👻'
      },
      {
        title: 'Short Costume Party Ping',
        text: 'Ready for tonight\'s fright fest? Costume on point, candy stocked, spooky vibes activated! 🧛‍♂️🕸️🎃',
        emojiCombo: '🧛‍♂️🕸️🎃'
      }
    ],
    faqs: [
      {
        question: 'What is the official Unicode name for the pumpkin emoji 🎃?',
        answer: 'It is officially named "JACK-O-LANTERN" in the Unicode Standard (U+1F383), featuring a carved grinning face with glowing yellow eyes.'
      },
      {
        question: 'Which emoji represents the full moon on Halloween?',
        answer: 'Full Moon (🌕, U+1F315) and Moon with Face (🌝) are frequently used alongside bats (🦇) and owls (🦉).'
      }
    ]
  },
  {
    slug: 'lunar-new-year',
    name: 'Lunar New Year (Spring Festival)',
    tagline: 'Spring Festival, Red Envelopes, Dragon Dances & Prosperity',
    icon: '🧧',
    seasonOrDate: 'January / February (First New Moon of Lunar Calendar)',
    region: 'China, Taiwan, Hong Kong, Vietnam (Tet), Korea (Seollal) & Global Asian Diaspora',
    h1: 'Lunar New Year Emojis: Red Envelope 🧧, Dragon 🐉, Wishes & Codes',
    description: 'Copy authentic Lunar New Year emojis including Red Envelope 🧧, Dragon 🐉, Red Lantern 🏮, Dumpling 🥟, and Tangerine 🍊. Pre-made Chinese New Year greetings and captions.',
    culturalSignificance: 'Lunar New Year (Chun节 / Spring Festival) is the grandest traditional holiday celebrated across East and Southeast Asia. Marking the end of winter and welcoming spring\'s renewal, families travel great distances for the reunion dinner (Nian Ye Fan). Homes are swept clean to sweep away bad luck, decorated with red couplets and glowing red lanterns (hongdenglong), and children are presented with lucky red envelopes (hongbao) stuffed with crisp banknotes.',
    traditions: [
      'Gifting lucky red envelopes (hongbao / li xi) filled with crisp money to children and elders',
      'Gathering for the lavish New Year\'s Eve family reunion dinner featuring whole fish, dumplings, and niangao',
      'Hanging red paper couplets, paper cutouts, and upside-down "Fu" (blessing) characters on front doors',
      'Watching majestic lion dances and acrobatic dragon dances accompanied by booming drums and cymbals',
      'Setting off midnight firecrackers and brilliant fireworks to drive away the mythological beast Nian'
    ],
    glyphs: ['🧧', '🐉', '🏮', '🥟', '🎆', '🍊', '🦁', '🥢', '🌸', '🐍', '🐅', '💰', '🪙', '🍜', '🎋', '✨'],
    combos: [
      { combo: '🧧🏮🐉✨', label: 'Lunar Prosperity', meaning: 'Red envelope, glowing paper lantern, lucky dragon, and festive sparkles.' },
      { combo: '🥟🥢🍊🍜', label: 'New Year Reunion Banquet', meaning: 'Handmade dumplings, chopsticks, lucky tangerines, and longevity noodles.' },
      { combo: '🦁🥁🎆🏮', label: 'Lion Dance Celebration', meaning: 'Acrobatic lion dance, traditional drums, fireworks, and lanterns.' },
      { combo: '💰🪙🧧🌸', label: 'Fortune & Blossom', meaning: 'Golden coins, wealth ingot, red packet, and blooming plum blossoms.' }
    ],
    greetings: [
      {
        title: 'Classic Prosperity & Health Wish',
        text: 'Gong Xi Fa Cai! Wishing you great fortune, glowing health, and boundless prosperity in the New Year. May all your dreams blossom! 🧧🐉🍊✨',
        emojiCombo: '🧧🐉🍊✨'
      },
      {
        title: 'Family Reunion & Harmony Blessing',
        text: 'Happy Lunar New Year! May the Spring Festival bring warmth, laughter, and abundant happiness to your family table! 🏮🥟🥢❤️',
        emojiCombo: '🏮🥟🥢❤️'
      },
      {
        title: 'Vietnamese Tet Greeting',
        text: 'Chuc Mung Nam Moi! Wishing you peace, prosperity, and endless joy in this vibrant season of renewal! 🧧🌸✨',
        emojiCombo: '🧧🌸✨'
      },
      {
        title: 'Cantonese New Year Wish',
        text: 'Kung Hei Fat Choy! Sun Tai Gin Hong (good health) and abundant fortune throughout the coming lunar cycle! 🧧🪙🐉',
        emojiCombo: '🧧🪙🐉'
      }
    ],
    faqs: [
      {
        question: 'Why is the red envelope 🧧 emoji used for Chinese New Year?',
        answer: 'Red Envelopes (hongbao) are filled with money and given as a symbol of good luck, health, and protection against evil spirits during Lunar New Year.'
      },
      {
        question: 'Why are tangerines 🍊 auspicious for Lunar New Year?',
        answer: 'In Chinese, the word for tangerine / mandarin orange sounds similar to "wealth" and "good luck" (ji), making them a staple decorative fruit.'
      }
    ]
  },
  {
    slug: 'new-year',
    name: 'New Year\'s Eve & Day',
    tagline: 'Midnight Countdown, Champagne Toasts & Fresh Beginnings',
    icon: '🎆',
    seasonOrDate: 'December 31 & January 1',
    region: 'Worldwide',
    h1: 'New Year Emojis & Midnight Wishes: Copy 🎆, Champagne 🥂, Party & Codes',
    description: 'Copy authentic New Year emojis: Fireworks 🎆, Clinking Glasses 🥂, Party Popper 🎉, Confetti 🎊, and Sparkles ✨. Ready-to-use New Year countdown captions and greetings.',
    culturalSignificance: 'New Year\'s Eve is the worldwide synchronized celebration of the transition between calendar years. As the clock strikes midnight across international time zones, billions gather in city squares, homes, and venues to count down from ten, toast with chilled champagne, embrace loved ones, watch dazzling pyrotechnic shows, and commit to fresh resolutions for the 365 days ahead.',
    traditions: [
      'Counting down the final 10 seconds to midnight with loved ones and friends',
      'Toasting with champagne or sparkling cider as clocks chime midnight',
      'Watching world-class fireworks shows over iconic city skylines (Sydney, Dubai, London, New York)',
      'Singing Robert Burns\'s "Auld Lang Syne" in remembrance of old friends and memories',
      'Writing fresh New Year\'s resolutions for personal growth, fitness, and achievements'
    ],
    glyphs: ['🎆', '🎇', '🥂', '🍾', '🕛', '🥳', '🎉', '🎊', '✨', '🎈', '🌟', '🪩', '💃', '🕺', '🗓️'],
    combos: [
      { combo: '🕛🥂🎆🎉', label: 'Midnight Strike', meaning: 'Twelve o\'clock chime, champagne toast, fireworks, and party popper.' },
      { combo: '🍾🪩🥳🕺', label: 'New Year Eve Dance Party', meaning: 'Popping champagne, disco mirror ball, dancing, and wild celebration.' },
      { combo: '✨🌟🗓️🌱', label: 'Fresh Start & Goals', meaning: 'Sparkles, guiding star, new calendar, and budding personal growth.' },
      { combo: '🎇🎊🥂💖', label: 'Heartfelt Midnight Cheers', meaning: 'Sparklers, confetti shower, clinking flutes, and deep love.' }
    ],
    greetings: [
      {
        title: 'Midnight Toast & Warm Wish',
        text: 'Happy New Year! Here\'s to 365 fresh pages, exciting adventures, vibrant health, and wonderful memories! Cheers to new beginnings! 🥂🎆🎉',
        emojiCombo: '🥂🎆🎉'
      },
      {
        title: 'Inspiring & Motivational New Year Text',
        text: 'May the coming year bring you closer to every dream you cherish. Step boldly into the future with courage, love, and gratitude! Happy New Year! ✨🌟🗓️',
        emojiCombo: '✨🌟🗓️'
      },
      {
        title: 'Social Media Midnight Countdown Caption',
        text: '3, 2, 1... HAPPY NEW YEAR! Out with the old, in with the gold. Wishing everyone peace, joy, and wild success this year! 🎆🥳🍾🪩',
        emojiCombo: '🎆🥳🍾🪩'
      },
      {
        title: 'Short WhatsApp Blast',
        text: 'Wishing you and your family a healthy, prosperous, and happy New Year! Let\'s make this one unforgettable! 🥂🎉✨',
        emojiCombo: '🥂🎉✨'
      }
    ],
    faqs: [
      {
        question: 'Which emoji represents the midnight champagne toast?',
        answer: 'Clinking Glasses (🥂, U+1F942) and Bottle with Popping Cork (🍾, U+1F37E) are the quintessential New Year toast emojis.'
      },
      {
        question: 'What is the difference between 🎆 and 🎇?',
        answer: '🎆 (Fireworks) depicts high-altitude sky explosions, while 🎇 (Sparkler) depicts a handheld incandescent metal stick throwing glowing sparks.'
      }
    ]
  },
  {
    slug: 'thanksgiving',
    name: 'Thanksgiving',
    tagline: 'Harvest Feasts, Warm Gratitude & Family Reunions',
    icon: '🦃',
    seasonOrDate: 'Fourth Thursday of November (US) / Second Monday of October (Canada)',
    region: 'United States, Canada & Global Celebrants',
    h1: 'Thanksgiving Emojis & Gratitude Wishes: Copy 🦃, Pie 🥧, Leaves & Codes',
    description: 'Copy authentic Thanksgiving emojis: Turkey 🦃, Pie 🥧, Fallen Leaf 🍂, Corn 🌽, and Bread. Ready-to-copy Thanksgiving gratitude messages and family dinner captions.',
    culturalSignificance: 'Thanksgiving is an annual national holiday celebrated in the United States and Canada honoring the autumn harvest and blessings of the past year. Families journey across the nation to gather around abundant dinner tables, carve roasted turkey with herb stuffing, enjoy cranberry sauce, mashed potatoes, and sweet pumpkin pie, while sharing what they are most grateful for in life.',
    traditions: [
      'Roasting a whole golden turkey with sage stuffing, cranberry relish, and gravy',
      'Baking spiced pumpkin pies, pecan pies, and warm apple crisps topped with whipped cream',
      'Going around the dinner table to share heartfelt moments of gratitude with family',
      'Watching the famous Macy\'s Thanksgiving Day Parade and football games',
      'Sharing leftovers and packing care packages for family and community shelters'
    ],
    glyphs: ['🦃', '🥧', '🍂', '🌽', '🍁', '🍗', '🍞', '🍎', '🤎', '🧡', '🍽️', '🙏', '🌰', '🥔', '🍇'],
    combos: [
      { combo: '🦃🥧🍂🍁', label: 'Autumn Harvest Feast', meaning: 'Turkey, pumpkin pie, fallen leaves, and red maple foilage.' },
      { combo: '🍽️🍗🌽🥔', label: 'Dinner Table Spread', meaning: 'Full dining plate, roasted poultry, sweetcorn, and mashed potatoes.' },
      { combo: '🙏🧡🥧✨', label: 'Heartfelt Gratitude', meaning: 'Prayer of thanks, warm orange heart, slice of pie, and warmth.' },
      { combo: '🦃🏈📺🥳', label: 'Thanksgiving Game Day', meaning: 'Turkey dinner, American football, television broadcast, and fun.' }
    ],
    greetings: [
      {
        title: 'Heartfelt Gratitude & Family Wish',
        text: 'Happy Thanksgiving! So grateful for your friendship, laughter, and support. May your day be surrounded by loved ones, good food, and warm memories! 🦃🥧🍂',
        emojiCombo: '🦃🥧🍂'
      },
      {
        title: 'Cozy Autumn Thanksgiving Text',
        text: 'Wishing you a harvest of blessings, good health, and delicious pie today! Happy Thanksgiving to you and yours! 🧡🍁🥧🙏',
        emojiCombo: '🧡🍁🥧🙏'
      },
      {
        title: 'Playful Turkey Day Caption',
        text: 'Feast mode: ACTIVATED. Wearing my stretchy pants and ready for seconds of pumpkin pie. Happy Thanksgiving everyone! 🦃🍗🥧😋',
        emojiCombo: '🦃🍗🥧😋'
      },
      {
        title: 'Professional Thanksgiving Note',
        text: 'Warmest Thanksgiving wishes to our clients and partners. Thank you for your continued trust, collaboration, and shared success this year! 🦃🍂🤝',
        emojiCombo: '🦃🍂🤝'
      }
    ],
    faqs: [
      {
        question: 'Which emoji is the turkey emoji?',
        answer: 'The Turkey emoji (🦃, U+1F983) features a proud wild turkey facing left with a fan-shaped tail feather display.'
      },
      {
        question: 'Is there a specific pumpkin pie emoji?',
        answer: 'Unicode catalogs Pie (🥧, U+1F967), which on Apple devices depicts a traditional golden-crusted spiced pumpkin pie slice with a dollop of cream.'
      }
    ]
  },
  {
    slug: 'valentines-day',
    name: 'Valentine\'s Day',
    tagline: 'Romantic Love, Heartfelt Affection, Roses & Chocolates',
    icon: '❤️',
    seasonOrDate: 'February 14',
    region: 'Worldwide',
    h1: 'Valentine\'s Day Emojis: Red Heart ❤️, Rose 🌹, Love Wishes & Codes',
    description: 'Copy authentic Valentine\'s Day emojis: Red Heart ❤️, Sparking Heart 💖, Rose 🌹, Chocolate 🍫, and Love Letter 💌. Romantic messages and anniversary captions ready to copy.',
    culturalSignificance: 'Saint Valentine\'s Day is an international celebration of romantic love, intimacy, friendship, and admiration. Every February 14, couples and admirers exchange handwritten love cards, fragrant red roses, gourmet chocolate truffles, teddy bears, and thoughtful gifts, often celebrating with romantic candlelit dinners and heartfelt pledges of devotion.',
    traditions: [
      'Gifting long-stemmed fragrant red roses symbolizing deep passionate romance',
      'Handwriting heartfelt romantic poems or cards sealed inside envelope love letters',
      'Sharing gourmet heart-shaped boxes of dark and milk chocolate truffles',
      'Dining at intimate candlelit restaurants or preparing homemade gourmet dinners together',
      'Celebrating "Galentine\'s Day" with close female friends to honor sisterhood and companionship'
    ],
    glyphs: ['❤️', '💖', '💘', '💝', '🌹', '🍫', '💌', '🧸', '💐', '💋', '💍', '💕', '👩‍❤️‍👨', '🧑‍🤝‍🧑', '🥂', '✨'],
    combos: [
      { combo: '❤️🌹🍫💌', label: 'Classic Valentine Gift', meaning: 'Red heart, blooming rose, chocolate box, and sealed love letter.' },
      { combo: '💘🧸💐✨', label: 'Cupid\'s Sweet Surprise', meaning: 'Arrow through heart, cuddly teddy bear, fresh bouquet, and magic.' },
      { combo: '🥂💍❤️🕯️', label: 'Romantic Proposal Dinner', meaning: 'Champagne toast, engagement ring, true love, and candlelight.' },
      { combo: '💕👭💐💖', label: 'Galentine Friendship', meaning: 'Two hearts, best friends holding hands, bouquet, and sparkling love.' }
    ],
    greetings: [
      {
        title: 'Deep Romantic Valentine Declaration',
        text: 'Happy Valentine\'s Day, my love! You make every single day brighter, sweeter, and more meaningful. Loving you is the easiest thing in the world! ❤️🌹🍫',
        emojiCombo: '❤️🌹🍫'
      },
      {
        title: 'Sweet & Tender Love Message',
        text: 'To my favorite person in the whole universe: thank you for your laughs, your kindness, and your endless warmth. Happy Valentine\'s Day! 💖🧸💌',
        emojiCombo: '💖🧸💌'
      },
      {
        title: 'Playful Flirty Text',
        text: 'Are you a magician? Because whenever I look at you, everyone else disappears. Happy Valentine\'s Day, gorgeous! 💘💋✨',
        emojiCombo: '💘💋✨'
      },
      {
        title: 'Galentine & Friendship Valentine',
        text: 'Happy Valentine\'s Day to the sweetest friend! Grateful for our endless chats, laughs, and bond. Sending you so much love today! 💕💐🥂',
        emojiCombo: '💕💐🥂'
      }
    ],
    faqs: [
      {
        question: 'What is the most sent emoji on Valentine\'s Day?',
        answer: 'The Red Heart (❤️) is the #1 most sent emoji worldwide on February 14, followed closely by Two Hearts (💕) and Rose (🌹).'
      },
      {
        question: 'What is the meaning of the Heart with Arrow 💘 emoji?',
        answer: 'Heart with Arrow (💘) represents Cupid\'s arrow striking, symbolizing falling head-over-heels in romantic love.'
      }
    ]
  },
  {
    slug: 'easter',
    name: 'Easter (Resurrection Sunday)',
    tagline: 'Spring Renewal, Decorated Eggs & Joyous Resurrection',
    icon: '🐰',
    seasonOrDate: 'March / April (First Sunday after Paschal Full Moon)',
    region: 'Worldwide',
    h1: 'Easter Emojis & Spring Wishes: Copy Bunny 🐰, Egg 🥚, Tulip 🌷 & Codes',
    description: 'Copy authentic Easter emojis: Easter Bunny 🐰, Egg 🥚, Hatching Chick 🐣, Tulip 🌷, and Cross ✝️. Ready-to-copy Easter blessings and spring greeting cards.',
    culturalSignificance: 'Easter (Pascha) is the principal festival of the Christian liturgical year, celebrating the resurrection of Jesus Christ from the dead on the third day following his crucifixion. Over millennia, religious worship featuring Easter vigils, joyful hymns, and dawn services has merged with joyful springtime customs: hiding painted Easter eggs for children to hunt, eating chocolate bunnies, and gathering for Sunday brunch amidst blooming spring flowers.',
    traditions: [
      'Coloring and decorating hard-boiled eggs with vibrant dye, wax, and patterns',
      'Organizing backyard Easter egg hunts with hidden chocolate eggs and pastel baskets',
      'Attending sunrise church services and singing hymns of resurrection and renewal',
      'Indulging in chocolate Easter bunnies, hot cross buns, and roasted lamb dinner',
      'Decorating tables with fresh spring flowers like white Easter lilies, daffodils, and tulips'
    ],
    glyphs: ['🐰', '🥚', '🐣', '🌷', '🌸', '🍫', '🐇', '🧺', '✝️', '🕊️', '🌿', '🌼', '🐥', '☀️', '🧁'],
    combos: [
      { combo: '🐰🥚🧺🌷', label: 'Easter Egg Hunt', meaning: 'Bunny rabbit, decorated eggs, woven basket, and spring tulips.' },
      { combo: '🐣🌸☀️🐥', label: 'Springtime Hatch', meaning: 'Hatching chick, blossom, warm spring sunshine, and baby bird.' },
      { combo: '✝️🕊️🕯️🌿', label: 'Holy Resurrection Peace', meaning: 'Christian cross, holy spirit dove, altar candle, and olive branch of hope.' },
      { combo: '🍫🐰🧁😋', label: 'Sweet Easter Treats', meaning: 'Chocolate bunny, spring cupcake, and festive sweet treats.' }
    ],
    greetings: [
      {
        title: 'Joyful Spring Easter Blessing',
        text: 'Happy Easter! May your day be blooming with renewed hope, peace, delicious chocolate treats, and warm family moments! 🐰🥚🌷',
        emojiCombo: '🐰🥚🌷'
      },
      {
        title: 'Spiritual Resurrection Sunday Greeting',
        text: 'He is risen! Wishing you and your loved ones a blessed, sacred Easter filled with faith, divine grace, and joy! ✝️🕊️✨',
        emojiCombo: '✝️🕊️✨'
      },
      {
        title: 'Playful Egg Hunt Text for Kids & Family',
        text: 'Hoppy Easter! Hope the Easter Bunny brings you gigantic chocolate eggs, sweet jellybeans, and a basket full of fun! 🐰🍫🧺',
        emojiCombo: '🐰🍫🧺'
      },
      {
        title: 'Warm Springtime Social Caption',
        text: 'Wishing everyone sunshine, blooming flowers, and sweet treats this Easter Sunday. Happy Spring! 🌸🐣☀️',
        emojiCombo: '🌸🐣☀️'
      }
    ],
    faqs: [
      {
        question: 'Why is the rabbit 🐰 associated with Easter?',
        answer: 'The Easter Bunny ("Osterhase") originated in German Lutheran folklore as an egg-laying hare that evaluated whether children were well-behaved at the start of spring.'
      },
      {
        question: 'What do decorated Easter eggs symbolize?',
        answer: 'Eggs have represented the rebirth of nature in spring and the Christian resurrection of Christ emerging from the tomb.'
      }
    ]
  },
  {
    slug: 'holi',
    name: 'Holi (Festival of Colors)',
    tagline: 'Vibrant Gulal Powders, Triumph of Good & Joyous Spring Dancing',
    icon: '🎨',
    seasonOrDate: 'March (Phalguna Purnima - Full Moon)',
    region: 'India, Nepal & Global Diaspora',
    h1: 'Holi Emojis & Color Wishes: Copy Palette 🎨, Rainbow 🌈, Quotes & Codes',
    description: 'Explore and copy vibrant Holi emojis including Artist Palette 🎨, Rainbow 🌈, Water Pistol 🔫, and Piñata 🪅. Copy-ready Happy Holi wishes and colorful status captions.',
    culturalSignificance: 'Holi is the exuberant Hindu spring festival known worldwide as the "Festival of Colors" and the "Festival of Spring". Celebrating the divine love of Radha and Krishna, and the triumph of virtue over evil through the legend of Prahlad and Holika, it is marked by people gathering in streets to playfully splash each other with fragrant colored powders (gulal) and water pistols (pichkaris), dancing to rhythmic dhol drums, and sharing mouthwatering gujiya pastries and thandai.',
    traditions: [
      'Lighting the ritual Holika Dahan bonfire on the eve of Holi to burn away negative energy',
      'Smearing vibrant colored herbal powders (gulal in pink, yellow, purple, green) onto friends and family',
      'Playing playfully with water guns (pichkaris) and filled water balloons in community courtyards',
      'Savoring sweet mawa-filled deep-fried gujiyas, spicy chaat, and saffron-cardamom thandai drinks',
      'Dancing enthusiastically to traditional dhol drum rhythms and Bollywood Holi anthems'
    ],
    glyphs: ['🎨', '🌈', '🔫', '🪅', '💃', '🕺', '🥁', '🌸', '💛', '🟣', '🟢', '💖', '💦', '☀️', '🍬', '✨'],
    combos: [
      { combo: '🎨🌈✨💃', label: 'Explosion of Colors', meaning: 'Palette of powders, brilliant rainbow, sparkles, and ecstatic dancing.' },
      { combo: '🔫💦🥳🥁', label: 'Pichkari Water Battle', meaning: 'Water gun, splashing droplets, happy laughter, and rhythmic dhol drums.' },
      { combo: '🌸🍬💛💖', label: 'Gujiya & Sweet Smiles', meaning: 'Spring blossom, traditional sweets, golden joy, and pink love.' },
      { combo: '🔥🕉️🙏✨', label: 'Holika Dahan Bonfire', meaning: 'Sacred bonfire purifying evil, holy Om, gratitude, and divine grace.' }
    ],
    greetings: [
      {
        title: 'Vibrant & Joyful Holi Greeting',
        text: 'Bura na mano, Holi hai! May your life be drenched in the vibrant colors of happiness, good health, peace, and prosperity! Happy Holi! 🎨🌈✨',
        emojiCombo: '🎨🌈✨'
      },
      {
        title: 'Warm Friendship Holi Message',
        text: 'Wishing you and your family a super joyful, colorful, and sweet Holi! May our friendship remain as colorful as the Holi gulal! 🌸💛💖🎨',
        emojiCombo: '🌸💛💖🎨'
      },
      {
        title: 'Energetic WhatsApp & Instagram Caption',
        text: 'Doused in colors, high on thandai, dancing to the dhol! Wishing everyone an ecstatic, safe, and memorable Holi! 🥁💃🌈🔫',
        emojiCombo: '🥁💃🌈🔫'
      },
      {
        title: 'Spiritual Holika Dahan Wish',
        text: 'May the holy bonfire of Holika Dahan burn away all negativity, illness, and sorrow, leaving behind pure joy and blessings! 🔥🙏✨',
        emojiCombo: '🔥🙏✨'
      }
    ],
    faqs: [
      {
        question: 'Which emoji is used for Holi colors?',
        answer: 'Artist Palette (🎨), Rainbow (🌈), Water Pistol (🔫), and colorful hearts (💖💛🟣🟢) are universally used to represent the vibrant gulal powders.'
      },
      {
        question: 'What does "Bura na mano, Holi hai" mean?',
        answer: 'It is the famous Hindi phrase meaning "Do not take offense, it is Holi!", spoken when playfully drenching friends and elders in color.'
      }
    ]
  },
  {
    slug: 'hanukkah',
    name: 'Hanukkah (Chanukah)',
    tagline: 'The Eight-Day Jewish Festival of Lights, Menorahs & Miracles',
    icon: '🕎',
    seasonOrDate: 'November / December (25th of Kislev for 8 Nights)',
    region: 'Israel, Jewish Communities Worldwide',
    h1: 'Hanukkah Emojis & Chanukah Wishes: Copy Menorah 🕎, Star ✡️ & Codes',
    description: 'Copy authentic Hanukkah emojis: Menorah 🕎, Star of David ✡️, Potato 🥔, Doughnut 🍩, and Coin 🪙. Ready Hanukkah blessings and festive greetings for 8 nights of light.',
    culturalSignificance: 'Hanukkah (the Festival of Dedication) is an eight-day Jewish festival commemorating the recovery of Jerusalem and subsequent rededication of the Second Temple at the beginning of the Maccabean Revolt in the 2nd century BCE. The miracle of a single day\'s supply of purified consecrated olive oil burning miraculously for eight nights is honored by lighting an additional candle each night on the nine-branched menorah (hanukkiah), playing with dreidels, and eating foods fried in oil such as crispy potato latkes and jelly doughnuts (sufganiyot).',
    traditions: [
      'Lighting the nine-branched hanukkiah menorah using the shamash (helper candle) each sundown',
      'Frying and enjoying golden potato latkes served with applesauce and sour cream',
      'Eating pillowy, jam-filled jelly doughnuts (sufganiyot) dusted with powdered sugar',
      'Playing the traditional four-sided spinning top dreidel game with chocolate gelt coins',
      'Singing traditional songs like "Ma\'oz Tzur" and sharing nightly gifts with children'
    ],
    glyphs: ['🕎', '✡️', '🥔', '🍩', '🪙', '💙', '🤍', '🕯️', '📜', '🕊️', '🎁', '🌟'],
    combos: [
      { combo: '🕎🕯️💙✨', label: 'Eight Nights of Light', meaning: 'Nine-branched menorah, glowing candle flames, blue star, and divine illumination.' },
      { combo: '🥔🍩🪙😋', label: 'Latkes & Sufganiyot', meaning: 'Crispy potato latkes, jam doughnuts, and chocolate gelt coins.' },
      { combo: '✡️📜🕊️💙', label: 'Temple Miracle Heritage', meaning: 'Star of David, Torah scroll, peace dove, and blue heart of faith.' },
      { combo: '🎁🕎👨‍👩‍👧‍👦❤️', label: 'Family Menorah Gathering', meaning: 'Eight nights of gifts, menorah lighting, and warm family bonding.' }
    ],
    greetings: [
      {
        title: 'Traditional Hanukkah Blessing',
        text: 'Chag Urim Sameach! May the warm glow of the menorah candles bring peace, health, and abundant blessings to your home this Hanukkah! 🕎💙✨',
        emojiCombo: '🕎💙✨'
      },
      {
        title: 'Eight Nights of Light Wish',
        text: 'Wishing you eight wonderful nights of light, sweet jelly doughnuts, crispy latkes, and laughter with family! Happy Hanukkah! 🕎🍩🥔🪙',
        emojiCombo: '🕎🍩🥔🪙'
      },
      {
        title: 'Social Media & Greeting Card Text',
        text: 'May your menorah burn bright and your miracles be plentiful. Warmest Chanukah wishes to you and your loved ones! 🕎✡️🕊️',
        emojiCombo: '🕎✡️🕊️'
      },
      {
        title: 'Short Holiday Ping',
        text: 'Happy Chanukah! Spinning dreidels, eating latkes, and sending you love across the miles! 🕎💙🍩',
        emojiCombo: '🕎💙🍩'
      }
    ],
    faqs: [
      {
        question: 'What is the official emoji for the Hanukkah lamp?',
        answer: 'Menorah (🕎, U+1F54E) officially depicts the ceremonial candelabrum with nine branches used during the eight days of Hanukkah.'
      },
      {
        question: 'Why are fried foods eaten during Hanukkah?',
        answer: 'Foods fried in oil (like latkes and sufganiyot) commemorate the miracle of the small jar of consecrated olive oil that burned for eight days in the Temple.'
      }
    ]
  },
  {
    slug: 'st-patricks-day',
    name: 'St. Patrick\'s Day',
    tagline: 'Irish Pride, Shamrocks, Leprechaun Luck & Green Beer',
    icon: '☘️',
    seasonOrDate: 'March 17',
    region: 'Ireland, United States, Canada, Australia & Worldwide',
    h1: 'St. Patrick\'s Day Emojis: Shamrock ☘️, Beer 🍻, Wishes & Irish Luck',
    description: 'Copy authentic St. Patrick\'s Day emojis: Shamrock ☘️, Four Leaf Clover 🍀, Beer 🍺, Rainbow 🌈, and Top Hat 🎩. Ready-made Irish blessings and party captions.',
    culturalSignificance: 'Saint Patrick\'s Day is an annual cultural and religious celebration on March 17 honoring the patron saint of Ireland, Saint Patrick. From Dublin to Chicago, New York, and Sydney, the day is celebrated by wearing bright emerald green, watching festive civic parades with bagpipes and step dancing, drinking pints of stout or green beer, and sharing traditional corned beef and cabbage.',
    traditions: [
      'Wearing green clothing, hats, and ribbons to prevent being playfully "pinched"',
      'Pinning a natural green three-leaf shamrock onto lapels to honor Irish heritage',
      'Marching in or watching festive city parades with bagpipers and Irish dancers',
      'Dyeing famous rivers green (such as the Chicago River in Illinois)',
      'Enjoying pints of dark Irish stout, Irish red ale, and sharing traditional soda bread'
    ],
    glyphs: ['☘️', '🍀', '🍺', '🍻', '🌈', '🪙', '🎩', '💚', '🇮🇪', '🎻', '🥔', '🧚', '🌿', '🧝', '✨'],
    combos: [
      { combo: '☘️🍺🎩🌈', label: 'The Irish Pub Crawl', meaning: 'Shamrock, cold pint of beer, green top hat, and leprechaun rainbow.' },
      { combo: '🍀🪙🌈✨', label: 'Pot of Gold Luck', meaning: 'Four-leaf clover, gold coin, rainbow end, and magical good fortune.' },
      { combo: '🇮🇪🎻🍻🕺', label: 'Ceili Folk Dance', meaning: 'Irish tricolor flag, fiddle violin, clinking mugs, and joyful dancing.' },
      { combo: '💚☘️🍀🌿', label: 'All Things Emerald Green', meaning: 'Pure Irish green aesthetic for St. Paddy\'s day.' }
    ],
    greetings: [
      {
        title: 'Classic Irish Blessing',
        text: 'May the road rise up to meet you, may the wind be ever at your back, and may good luck follow you wherever you roam! Happy St. Patrick\'s Day! ☘️🌈🍻',
        emojiCombo: '☘️🌈🍻'
      },
      {
        title: 'Fun Party & Cheers Wish',
        text: 'Sláinte! Here\'s to cold beer, great friends, and four-leaf clovers. Wishing you a super fun St. Patrick\'s Day! 🍻🍀🎩',
        emojiCombo: '🍻🍀🎩'
      },
      {
        title: 'Short Green WhatsApp Ping',
        text: 'Don\'t forget to wear green today or get pinched! Happy St. Paddy\'s Day to the luckiest person I know! 💚☘️✨',
        emojiCombo: '💚☘️✨'
      },
      {
        title: 'Social Media Pub Caption',
        text: 'May your day be touched by some Irish luck, brightened by a song in your heart, and warmed by the pints in your hands! 🇮🇪🍺🎻',
        emojiCombo: '🇮🇪🍺🎻'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between ☘️ (Shamrock) and 🍀 (Four Leaf Clover)?',
        answer: 'Shamrock (☘️) has three leaves and is the historical symbol of Ireland and Saint Patrick. Four Leaf Clover (🍀) has four leaves and represents universal rare good luck.'
      },
      {
        question: 'What does "Sláinte" mean?',
        answer: 'It is the traditional Irish and Gaelic toast meaning "Good health!", pronounced "SLAHN-chuh".'
      }
    ]
  },
  {
    slug: 'day-of-the-dead',
    name: 'Day of the Dead (Día de los Muertos)',
    tagline: 'Honoring Ancestors, Sugar Skulls, Marigolds & Celebration of Life',
    icon: '💀',
    seasonOrDate: 'November 1 & 2',
    region: 'Mexico, Latin America & Global Hispanic Diaspora',
    h1: 'Day of the Dead Emojis: Sugar Skull 💀, Candle 🕯️, Cempasúchil & Wishes',
    description: 'Copy authentic Day of the Dead (Día de los Muertos) emojis: Skull 💀, Candle 🕯️, Marigold Blossom 🌼, Bread 🍞, and Guitar 🎸. Cultural meanings and ofrenda captions.',
    culturalSignificance: 'Día de los Muertos is an ancient Mexican holiday celebrated on November 1 and 2, harmoniously blending Indigenous Aztec traditions honoring the deceased with Catholic All Saints\' and All Souls\' Days. Rather than mourning, it is an exuberant celebration of life where families build colorful multi-tiered altars (ofrendas) decorated with glowing orange cempasúchil marigolds, sweet pan de muerto, sugar skulls (calaveras), and favorite foods to welcome the spirits of departed loved ones back for a joyous reunion.',
    traditions: [
      'Building intricate family altars (ofrendas) with photos of ancestors and glowing candles',
      'Scattering bright orange marigold flower petals (cempasúchil) to guide souls home with fragrance',
      'Baking sweet, anise-scented round bread of the dead (pan de muerto) topped with bone shapes',
      'Painting faces as elaborate sugar skulls (La Catrina) with colorful floral and skeletal designs',
      'Playing traditional mariachi music, sharing humorous calaveritas literary poems, and celebrating'
    ],
    glyphs: ['💀', '🕯️', '🌼', '🍞', '🎭', '🧡', '🌮', '🎺', '🎸', '🕊️', '🪅', '🏵️', '🖤', '🎨', '🌺'],
    combos: [
      { combo: '💀🌼🕯️🧡', label: 'The Sacred Ofrenda', meaning: 'Sugar skull, marigold blossoms, altar candle, and warm orange love.' },
      { combo: '🎺🎸💃🎭', label: 'Mariachi Remembrance', meaning: 'Brass trumpet, acoustic guitar, dancing, and theatrical Catrina mask.' },
      { combo: '🍞🌮🍬🍷', label: 'Feast for the Ancestors', meaning: 'Pan de muerto, ancestral foods, and offerings.' },
      { combo: '🕊️💀✨🖤', label: 'Eternal Soul Journey', meaning: 'Peaceful spirit, departed ancestor, divine sparkle, and deep reverence.' }
    ],
    greetings: [
      {
        title: 'Soulful Remembrance Blessing',
        text: 'Feliz Día de los Muertos! Remembering and honoring our beloved ancestors who paved the path before us. Their love and legacy will never fade! 💀🌼🕯️🧡',
        emojiCombo: '💀🌼🕯️🧡'
      },
      {
        title: 'Joyful Celebration of Life Wish',
        text: 'Today we celebrate that love transcends the physical world. May your home be filled with bright marigolds, sweet memories, and warm ancestral presence! 🌼🕯️✨',
        emojiCombo: '🌼🕯️✨'
      },
      {
        title: 'Ofrenda & Family Caption',
        text: 'Death does not end a relationship; it merely changes it. Lighting candles for our loved ones tonight. Nunca te olvidaremos. 💀🏵️🕯️',
        emojiCombo: '💀🏵️🕯️'
      },
      {
        title: 'Festive Catrina Celebration Text',
        text: 'Sugar skulls on, music playing, ofrenda glowing! Celebrating eternal love and life this Día de los Muertos! 🎭🎺💀🌼',
        emojiCombo: '🎭🎺💀🌼'
      }
    ],
    faqs: [
      {
        question: 'Is Day of the Dead the Mexican version of Halloween?',
        answer: 'No. While they share the calendar dates, Halloween is spooky and mischievous, whereas Día de los Muertos is a sacred, affectionate celebration of life and familial remembrance.'
      },
      {
        question: 'What flower represents the Day of the Dead?',
        answer: 'The yellow-orange marigold (cempasúchil), represented in emojis by Blossom (🌼) or Rosette (🏵️), whose scent guides ancestral spirits home.'
      }
    ]
  },
  {
    slug: 'carnival',
    name: 'Carnival & Mardi Gras',
    tagline: 'Samba Parades, Masquerade Balls, Brass Bands & Fat Tuesday',
    icon: '🎭',
    seasonOrDate: 'February / March (Days Leading up to Ash Wednesday)',
    region: 'Brazil (Rio de Janeiro), Italy (Venice), New Orleans (Mardi Gras), Trinidad & Worldwide',
    h1: 'Carnival & Mardi Gras Emojis: Mask 🎭, Trumpet 🎺, Feathers & Wishes',
    description: 'Copy authentic Carnival and Mardi Gras emojis: Performing Arts Mask 🎭, Piñata 🪅, Drum 🥁, Saxophone 🎷, and Crown 👑. Ready-to-use Carnival captions and Fat Tuesday wishes.',
    culturalSignificance: 'Carnival (and Mardi Gras / "Fat Tuesday") is the world-renowned festive season of masquerade, dance, and indulgence occurring before the liturgical season of Lent. From the world-famous samba parades of the Sambadrome in Rio de Janeiro to the elegant baroque masked balls of Venice and the lively jazz and bead-tossing krewes of New Orleans, Carnival invites everyone to don dazzling costumes, dance in streets, and let the good times roll.',
    traditions: [
      'Catching colorful beaded necklaces and doubloon coins thrown from parade floats',
      'Wearing exquisite feathered costumes, crowns, and ornate Venetian masquerade masks',
      'Dancing to infectious samba rhythms, brass marching bands, and soca beats',
      'Eating traditional King Cake with purple, green, and gold sugar, finding the hidden baby',
      'Parading with historic krewes through city avenues in full festive regalia'
    ],
    glyphs: ['🎭', '🪅', '🥁', '🎷', '📯', '👑', '💃', '🕺', '🥳', '🟣', '🟢', '🟡', '🎺', '🪩', '🎊', '✨'],
    combos: [
      { combo: '🎭👑🪅✨', label: 'Mardi Gras Royalty', meaning: 'Masquerade mask, parade king crown, festive piñata, and sparkles.' },
      { combo: '🟣🟢🟡📯', label: 'The Tricolor Krewe', meaning: 'Official Mardi Gras colors: Purple (justice), Green (faith), and Gold (power).' },
      { combo: '💃🥁🎷🥳', label: 'Rio Samba Street Party', meaning: 'Samba queen, percussion drums, jazz sax, and joyous dancers.' },
      { combo: '🪩🎊🎺🕺', label: 'Carnival Night Fever', meaning: 'Mirror ball, confetti blast, brass horn, and dancing.' }
    ],
    greetings: [
      {
        title: 'Classic Mardi Gras Cheer',
        text: 'Laissez les bons temps rouler! Let the good times roll! Wishing you a dazzling, bead-catching, music-filled Mardi Gras! 🎭👑🎺🎉',
        emojiCombo: '🎭👑🎺🎉'
      },
      {
        title: 'Rio Carnival Samba Energy',
        text: 'Viva Carnival! May your days be filled with vibrant rhythm, sparkling feathers, and joyful dancing under the sun! 💃🥁🪩✨',
        emojiCombo: '💃🥁🪩✨'
      },
      {
        title: 'Venetian Masquerade Elegance',
        text: 'Step behind the mask and enjoy the mystery. Wishing you a magical and unforgettable Carnival season! 🎭✨👑',
        emojiCombo: '🎭✨👑'
      },
      {
        title: 'Social Media Party Caption',
        text: 'King cake eaten, beads flying, brass bands booming! Happy Fat Tuesday to all! 🟣🟢🟡📯',
        emojiCombo: '🟣🟢🟡📯'
      }
    ],
    faqs: [
      {
        question: 'What do the three Mardi Gras colors represent?',
        answer: 'Purple (🟣) symbolizes justice, Green (🟢) symbolizes faith, and Gold/Yellow (🟡) symbolizes power.'
      },
      {
        question: 'Which emoji best represents the Carnival masquerade?',
        answer: 'Performing Arts Mask (🎭, U+1F3AD) depicts the classic comedy and tragedy masks synonymous with Carnival masquerades.'
      }
    ]
  },
  {
    slug: 'mid-autumn-festival',
    name: 'Mid-Autumn Festival (Mooncake Festival)',
    tagline: 'Harvest Full Moon, Mooncakes, Lanterns & Family Harmony',
    icon: '🥮',
    seasonOrDate: 'September / October (15th Day of 8th Lunar Month)',
    region: 'China, Taiwan, Vietnam, Korea (Chuseok), Japan (Tsukimi) & East Asian Diaspora',
    h1: 'Mid-Autumn Festival Emojis: Mooncake 🥮, Full Moon 🌕, Lantern & Wishes',
    description: 'Copy authentic Mid-Autumn Festival emojis: Mooncake 🥮, Full Moon 🌕, Red Lantern 🏮, Rabbit 🐇, and Tea 🍵. Ready mooncake greetings and family reunion wishes.',
    culturalSignificance: 'The Mid-Autumn Festival (Zhongqiu Jie) is an ancient East Asian harvest celebration honoring the fullest, brightest moon of the autumn season. Rooted in moon worship and the mythology of Chang\'e (the Moon Goddess) and the Jade Rabbit, families reunite to admire the luminous night sky, carry glowing paper lanterns, and share sweet mooncakes filled with lotus seed paste, red bean paste, and salted duck egg yolks symbolizing wholeness and family completeness.',
    traditions: [
      'Gifting and slicing ornate baked mooncakes to share with family and friends',
      'Gathering outdoors under the moonlight to admire the glowing autumn full moon (yuèbǐng)',
      'Lighting and carrying handheld colorful paper lanterns through neighborhood parks',
      'Sipping fragrant osmanthus tea and sharing harvest pomelo fruits with elders',
      'Celebrating Chuseok (Korean Thanksgiving) with songpyeon rice cakes or Japanese Tsukimi dango'
    ],
    glyphs: ['🥮', '🌕', '🏮', '🐇', '🍵', '🍂', '🍁', '🌾', '🏮', '🫖', '🎑', '✨', '💛', '🌸'],
    combos: [
      { combo: '🥮🌕🏮🍵', label: 'Mid-Autumn Tea & Moon', meaning: 'Lotus mooncake, full harvest moon, glowing lantern, and hot green tea.' },
      { combo: '🐇🌕✨🎑', label: 'The Jade Rabbit Legend', meaning: 'The Jade Rabbit on the glowing full moon beside the traditional moon viewing ceremony.' },
      { combo: '🏮👨‍👩‍👧‍👦🥮❤️', label: 'Family Moon Reunion', meaning: 'Lantern light, family together, sharing mooncakes, and love.' },
      { combo: '🍁🌾🫖🌕', label: 'Autumn Harvest Tranquility', meaning: 'Autumn foliage, harvest grains, steaming teapot, and full moon.' }
    ],
    greetings: [
      {
        title: 'Classic Mooncake Festival Wish',
        text: 'Happy Mid-Autumn Festival! May the full moon illuminate your path with harmony, prosperity, and endless joy! 🥮🌕🏮✨',
        emojiCombo: '🥮🌕🏮✨'
      },
      {
        title: 'Family Reunion & Wholeness Blessing',
        text: 'Wishing you and your beloved family a joyous reunion. Just as the mooncake is round and full, may your life be complete and sweet! 🥮🍵❤️',
        emojiCombo: '🥮🍵❤️'
      },
      {
        title: 'Poetic Lunar Caption',
        text: 'Though miles apart, we share the beauty of the very same moon. Wishing you love, peace, and sweet mooncakes tonight! 🌕🐇✨',
        emojiCombo: '🌕🐇✨'
      },
      {
        title: 'Korean Chuseok Greeting',
        text: 'Happy Chuseok! Wishing you an abundant autumn harvest, heartwarming family gatherings, and delicious songpyeon! 🌾🥮🌕',
        emojiCombo: '🌾🥮🌕'
      }
    ],
    faqs: [
      {
        question: 'Which emoji is the official Mooncake emoji?',
        answer: 'Mooncake (🥮, U+1F96E) was approved in Unicode 11.0 (2018), featuring a round golden Chinese pastry with intricate surface character designs.'
      },
      {
        question: 'Why is the rabbit 🐇 associated with the moon in Asian folklore?',
        answer: 'Ancient East Asian folklore sees the craters of the full moon as the Jade Rabbit pounding the elixir of immortality.'
      }
    ]
  },
  {
    slug: 'ramadan',
    name: 'Ramadan',
    tagline: 'Holy Month of Fasting, Spiritual Reflection, Iftar & Charity',
    icon: '🌙',
    seasonOrDate: '9th Month of Islamic Lunar Calendar (Lasts 29-30 Days)',
    region: 'Worldwide Islamic Community',
    h1: 'Ramadan Emojis: Crescent Moon 🌙, Mosque 🕌, Dates & Mubarak Wishes',
    description: 'Copy authentic Ramadan emojis: Crescent Moon 🌙, Mosque 🕌, Palms Up 🤲, Kaaba 🕋, and Prayer Beads 📿. Pre-written Ramadan Kareem and Ramadan Mubarak wishes.',
    culturalSignificance: 'Ramadan is the ninth and holiest month of the Islamic calendar, commemorating the initial revelation of the Quran to Prophet Muhammad. Observed by Muslims worldwide as a month of dawn-to-sunset fasting (sawm), deep spiritual devotion, charity (zakat), and Quran recitation, it is characterized by communal pre-dawn meals (suhoor), nightly breaking of the fast (iftar) with sweet dates, and late-night tarawih prayers in the mosque.',
    traditions: [
      'Observing dawn-to-sunset fasting from all food, water, and negative speech',
      'Breaking the fast at sundown with water and sweet dates, following the Sunnah',
      'Gathering with extended family and community for lavish nightly iftar dinners',
      'Performing nightly Tarawih prayers in congregation at local mosques',
      'Increasing charitable donations (zakat and sadaqah) to nourish the hungry'
    ],
    glyphs: ['🌙', '🕌', '🕋', '🤲', '📿', '🍲', '🥛', '🌴', '📖', '⭐', '🕊️', '🫖', '🥘', '✨', '💚'],
    combos: [
      { combo: '🌙🕌🤲✨', label: 'Ramadan Night Prayers', meaning: 'Crescent moon, mosque minarets, supplication hands, and divine blessings.' },
      { combo: '🌴🥛🍲😋', label: 'Iftar Sunset Meal', meaning: 'Date palms, glass of milk, hearty soup, and breaking the daily fast.' },
      { combo: '📖📿🕋💚', label: 'Spiritual Devotion', meaning: 'Holy book Quran, prayer beads, sacred Kaaba, and green heart of peace.' },
      { combo: '🌙⭐🕊️🤲', label: 'Laylat al-Qadr Vigil', meaning: 'The Night of Power, star, dove of peace, and heartfelt prayers.' }
    ],
    greetings: [
      {
        title: 'Traditional Ramadan Kareem Greeting',
        text: 'Ramadan Kareem! May this holy month bring you and your family abundant peace, deepened faith, good health, and countless blessings! 🌙🕌✨',
        emojiCombo: '🌙🕌✨'
      },
      {
        title: 'Spiritual Fasting & Prayer Blessing',
        text: 'Wishing you a blessed Ramadan. May Allah accept your fasts, answer your heartfelt prayers, and fill your days with spiritual tranquility! 🤲💚🌙',
        emojiCombo: '🤲💚🌙'
      },
      {
        title: 'Iftar Invitation & Family Wish',
        text: 'May your iftar tables be blessed with warmth, delicious food, and the company of those you cherish most. Ramadan Mubarak! 🌴🍲🌙',
        emojiCombo: '🌴🍲🌙'
      },
      {
        title: 'Professional Ramadan Note',
        text: 'Warmest wishes to our colleagues and clients observing the holy month of Ramadan. Wishing you peace, reflection, and strength throughout! 🌙🤝✨',
        emojiCombo: '🌙🤝✨'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Ramadan Mubarak and Ramadan Kareem?',
        answer: 'Both are standard greetings: "Ramadan Mubarak" translates to "Blessed Ramadan", while "Ramadan Kareem" translates to "Generous Ramadan".'
      },
      {
        question: 'Which emoji represents the breaking of the fast?',
        answer: 'Palms Up (🤲), Crescent Moon (🌙), and Palm Tree (🌴, representing sweet dates) are universally shared at iftar sunset.'
      }
    ]
  },
  {
    slug: 'oktoberfest',
    name: 'Oktoberfest',
    tagline: 'Bavarian Folk Heritage, Giant Pretzels, Brass Oompah & Beer Steins',
    icon: '🍺',
    seasonOrDate: 'Mid-September to First Sunday of October',
    region: 'Munich, Bavaria (Germany) & Global Beer Festivals',
    h1: 'Oktoberfest Emojis: Beer 🍺, Pretzel 🥨, German Flag & Bavarian Wishes',
    description: 'Copy authentic Oktoberfest emojis: Beer Mug 🍺, Clinking Beer Mugs 🍻, Pretzel 🥨, Sausage 🌭, and German Flag 🇩🇪. Ready-to-copy Prost greetings and folk fest captions.',
    culturalSignificance: 'Oktoberfest is the world\'s largest folk festival (Volksfest), held annually in Munich, Bavaria, Germany. Originating in 1810 to celebrate the royal wedding of Crown Prince Ludwig to Princess Therese, the 16-to-18-day celebration welcomes millions of international visitors to enjoy traditional Bavarian brass music, hearty roasted chicken (Hendl), giant salted soft pretzels (Brezn), and world-famous Bavarian beers poured into heavy one-liter glass steins (Maßkrug).',
    traditions: [
      'Tapping the first ceremonial beer keg with the cry "O\'zapft is!" (It is tapped!)',
      'Wearing traditional Bavarian Tracht: Dirndl dresses for women and Lederhosen for men',
      'Clinking heavy 1-liter glass beer steins (Maß) while singing "Ein Prosit der Gemütlichkeit"',
      'Munching on warm golden pretzels (Brezn), grilled bratwursts, and roasted half-chickens',
      'Singing along with live brass oompah bands inside massive festive festival tents'
    ],
    glyphs: ['🍺', '🍻', '🥨', '🌭', '🍗', '🇩🇪', '🎺', '🎪', '🍂', '🥩', '🎶', '🥳', '✨'],
    combos: [
      { combo: '🍺🥨🇩🇪🎺', label: 'Classic Bavarian Fest', meaning: 'Beer stein, giant pretzel, German tricolor flag, and brass oompah trumpet.' },
      { combo: '🍻🎪🍗🥳', label: 'Tent Celebration', meaning: 'Clinking beer steins, festival tent, roasted chicken, and wild party.' },
      { combo: '🥨🌭🍺😋', label: 'Bavarian Feast', meaning: 'Soft pretzel, bratwurst, cold beer, and delicious appetite.' },
      { combo: '🎶🎺🍻💃', label: 'Folk Music Singalong', meaning: 'Brass melody, horn, cheering steins, and traditional dancing.' }
    ],
    greetings: [
      {
        title: 'Classic Prost! (Cheers) Greeting',
        text: 'O\'zapft is! Wishing you an unforgettable Oktoberfest! Raise your steins, enjoy the giant pretzels, and sing along to the brass band! Prost! 🍺🥨🇩🇪',
        emojiCombo: '🍺🥨🇩🇪'
      },
      {
        title: 'Bavarian Friendship & Beer Wish',
        text: 'Ein Prosit der Gemütlichkeit! Here\'s to great beer, warm pretzels, and fantastic friends. Happy Oktoberfest! 🍻🥨🎶',
        emojiCombo: '🍻🥨🎶'
      },
      {
        title: 'Social Media Festival Caption',
        text: 'Lederhosen on, stein in hand, pretzel ready! Living my best Bavarian life this Oktoberfest! 🍺🎪🎺',
        emojiCombo: '🍺🎪🎺'
      },
      {
        title: 'Short Weekend Cheers',
        text: 'Happy Oktoberfest! May your beer be ice-cold and your weekend full of laughter! Cheers! 🍻🥨✨',
        emojiCombo: '🍻🥨✨'
      }
    ],
    faqs: [
      {
        question: 'What is the official emoji for a pretzel?',
        answer: 'Pretzel (🥨, U+1F968) depicts a classic Bavarian twisted knot bread sprinkled with white coarse sea salt crystals.'
      },
      {
        question: 'What does "O\'zapft is!" mean?',
        answer: 'It is the Bavarian phrase shouted by the Mayor of Munich after tapping the first keg, officially declaring Oktoberfest open.'
      }
    ]
  },
  {
    slug: 'mothers-fathers-day',
    name: 'Mother\'s Day & Father\'s Day',
    tagline: 'Honoring Parents, Unconditional Love, Flowers & Gratitude',
    icon: '💐',
    seasonOrDate: 'May (Mother\'s Day) & June (Father\'s Day)',
    region: 'Worldwide',
    h1: 'Mother\'s & Father\'s Day Emojis: Bouquet 💐, Necktie 👔, Wishes & Codes',
    description: 'Copy authentic Mother\'s and Father\'s Day emojis: Flower Bouquet 💐, Rose 🌹, Necktie 👔, Heart 💖, and Family. Heartfelt thank-you messages and cards for parents.',
    culturalSignificance: 'Mother\'s Day and Father\'s Day are dedicated annual celebrations honoring motherhood, fatherhood, maternal and paternal bonds, and the tireless influence of parents and caregivers in society. Celebrated in over 100 countries across spring and summer, children honor their parents with breakfast in bed, flower bouquets, handwritten cards expressing gratitude, neckties, gadgets, and quality family time.',
    traditions: [
      'Surprising mothers with breakfast in bed and fresh spring flower bouquets',
      'Handwriting cards expressing gratitude for years of sacrifices, guidance, and love',
      'Treating fathers to barbecue cookouts, sporting events, or outdoor adventures',
      'Gifting classic keepsakes such as perfumes, watches, neckties, and family framed photos',
      'Gathering multiple generations (grandparents, parents, children) for celebratory dinners'
    ],
    glyphs: ['💐', '🌸', '🌹', '👨‍👧‍👦', '👩‍👧‍👦', '🎁', '💖', '👔', '🧸', '💌', '🫂', '👑', '🎂', '🌷', '✨'],
    combos: [
      { combo: '💐🌸💖👩‍👧‍👦', label: 'Mother\'s Loving Bouquet', meaning: 'Fresh flower bouquet, blossom, pink heart, and mother with children.' },
      { combo: '👔👑👨‍👧‍👦⭐', label: 'Best Dad Ever', meaning: 'Smart necktie, king crown, father with children, and star.' },
      { combo: '💌🎁🌹✨', label: 'Heartfelt Card & Gift', meaning: 'Love letter, wrapped present, red rose, and magical gratitude.' },
      { combo: '🫂❤️🎂🌷', label: 'Warm Family Hug', meaning: 'Tight embrace, true love, celebratory cake, and springtime tulip.' }
    ],
    greetings: [
      {
        title: 'Sweet & Emotional Mother\'s Day Wish',
        text: 'Happy Mother\'s Day to the queen of our hearts! Thank you for your endless patience, unconditional love, and warm hugs. You are my greatest inspiration! 💐💖👑',
        emojiCombo: '💐💖👑'
      },
      {
        title: 'Proud & Grateful Father\'s Day Wish',
        text: 'Happy Father\'s Day, Dad! Thank you for always being my rock, my coach, and my guide. So grateful for everything you do! 👔⭐👨‍👧‍👦',
        emojiCombo: '👔⭐👨‍👧‍👦'
      },
      {
        title: 'Short & Loving Parent Text',
        text: 'To the best parent in the entire world: thank you for making home the warmest place on earth. Love you more than words can say! ❤️💌💐',
        emojiCombo: '❤️💌💐'
      },
      {
        title: 'Social Tribute Caption',
        text: 'Celebrating the incredible person who taught me kindness, resilience, and love. Happy Mother\'s & Father\'s Day! 🌸✨🫂',
        emojiCombo: '🌸✨🫂'
      }
    ],
    faqs: [
      {
        question: 'Which emoji is most sent for Mother\'s Day?',
        answer: 'Bouquet (💐, U+1F490) is the #1 most used emoji on Mother\'s Day, followed by Red Rose (🌹) and Pink Sparking Heart (💖).'
      },
      {
        question: 'Which emoji represents Father\'s Day?',
        answer: 'Necktie (👔, U+1F454), Trophy (🏆), and Crown (👑) are the most popular symbols chosen for Father\'s Day.'
      }
    ]
  },
  {
    slug: 'earth-day',
    name: 'Earth Day & Environment Day',
    tagline: 'Global Climate Harmony, Green Living, Tree Planting & Conservation',
    icon: '🌍',
    seasonOrDate: 'April 22 (Earth Day) & June 5 (World Environment Day)',
    region: 'Worldwide (Over 190 Countries)',
    h1: 'Earth Day Emojis: Globe 🌍, Seedling 🌱, Recycle ♻️ & Green Wishes',
    description: 'Copy authentic Earth Day emojis: Earth Globe 🌍, Seedling 🌱, Deciduous Tree 🌳, Recycle ♻️, and Ocean Wave 🌊. Environmental action captions and conservation quotes ready to copy.',
    culturalSignificance: 'Earth Day (April 22) and World Environment Day (June 5) are global civic events mobilizing over 1 billion people in more than 190 countries to take meaningful action for environmental protection. First organized in 1970, the movement fosters community beach cleanups, mass tree planting campaigns, climate education, renewable energy initiatives, and sustainable lifestyle choices to safeguard our blue planet for future generations.',
    traditions: [
      'Planting native trees, wildflowers, and pollinator-friendly garden plants',
      'Organizing community litter pickups across local beaches, riverbanks, and parks',
      'Pledging to reduce single-use plastics, conserve water, and walk or bicycle more',
      'Attending environmental education workshops, documentary screenings, and climate talks',
      'Supporting renewable energy and biodiversity conservation initiatives worldwide'
    ],
    glyphs: ['🌍', '🌎', '🌏', '🌱', '🌳', '🌿', '🍃', '🌻', '♻️', '☀️', '🌊', '🦋', '🐝', '🐾', '🌸', '✨'],
    combos: [
      { combo: '🌍🌱🌳💚', label: 'Protect Mother Earth', meaning: 'Earth globe, seedling, mature tree, and green heart for nature.' },
      { combo: '♻️🌊🍃☀️', label: 'Sustainable Harmony', meaning: 'Recycling loop, clean ocean wave, green leaf, and renewable solar sun.' },
      { combo: '🐝🌻🦋🌸', label: 'Pollinator Garden', meaning: 'Honeybee, sunflower, monarch butterfly, and blooming blossoms.' },
      { combo: '🌍🤝🌱✨', label: 'Global Environmental Action', meaning: 'Worldwide unity, planting seeds of hope, and sustainable future.' }
    ],
    greetings: [
      {
        title: 'Inspiring Earth Day Declaration',
        text: 'Happy Earth Day! The Earth is what we all have in common. Let\'s cherish, protect, and restore our beautiful planet today and every day! 🌍🌱🌊',
        emojiCombo: '🌍🌱🌊'
      },
      {
        title: 'Action & Sustainability Pledge',
        text: 'Small daily actions make a monumental difference. Plant a tree, reduce waste, and live kindly with nature. Happy Earth Day! 🌳♻️🍃',
        emojiCombo: '🌳♻️🍃'
      },
      {
        title: 'Social Media Environmental Caption',
        text: 'There is no Planet B. Stand up for clean oceans, thriving forests, and a greener tomorrow. Love Mother Earth! 🌎💚✨',
        emojiCombo: '🌎💚✨'
      },
      {
        title: 'Community Tree Planting Call',
        text: 'Planting seeds of hope today for tomorrow\'s generations. Let\'s make the world a little greener together! 🌱🌻🐝',
        emojiCombo: '🌱🌻🐝'
      }
    ],
    faqs: [
      {
        question: 'Which globe emoji should I use for Earth Day?',
        answer: 'Unicode has three regional globes: Globe Showing Europe-Africa (🌍), Globe Showing Americas (🌎), and Globe Showing Asia-Australia (🌏).'
      },
      {
        question: 'What is the official recycling emoji in Unicode?',
        answer: 'Recycling Symbol (♻️, U+267B) represents the universal Möbius loop of three chasing arrows for waste reduction.'
      }
    ]
  }
];

// Enrich each festival with mapped emojiSlugs
const enriched = FESTIVALS_RAW.map(fest => {
  const emojiSlugs = getSlugsForGlyphs(fest.glyphs);
  return {
    ...fest,
    emojiSlugs
  };
});

fs.writeFileSync(
  path.join(__dirname, '../data/festivals.json'),
  JSON.stringify(enriched, null, 2),
  'utf8'
);

console.log(`Generated ${enriched.length} festivals successfully in data/festivals.json!`);
