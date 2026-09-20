const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, '..', 'public', 'emoji-kitchen');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 25 Curated blends with authentic emoji kitchen style SVG
const BLENDS = [
  {
    id: 'cat_heart',
    emoji1: '🐱',
    emoji2: '❤️',
    name: 'Cat in Love',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="catFace" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#FFF176"/>
      <stop offset="85%" stop-color="#FFD54F"/>
      <stop offset="100%" stop-color="#FFB300"/>
    </radialGradient>
    <radialGradient id="heartRed" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="70%" stop-color="#D50000"/>
      <stop offset="100%" stop-color="#9B0000"/>
    </radialGradient>
  </defs>
  <!-- Cat Ears -->
  <polygon points="26,60 14,18 56,36" fill="#FFA000"/>
  <polygon points="26,54 20,24 50,38" fill="#FF80AB"/>
  <polygon points="102,60 114,18 72,36" fill="#FFA000"/>
  <polygon points="102,54 108,24 78,38" fill="#FF80AB"/>
  <!-- Head -->
  <ellipse cx="64" cy="72" rx="52" ry="46" fill="url(#catFace)"/>
  <!-- Blushing Cheeks -->
  <ellipse cx="28" cy="80" rx="12" ry="7" fill="#FF80AB" opacity="0.6"/>
  <ellipse cx="100" cy="80" rx="12" ry="7" fill="#FF80AB" opacity="0.6"/>
  <!-- Heart Eyes -->
  <g transform="translate(38, 56) scale(0.65)">
    <path d="M0,0 C-10,-20 -35,-10 -35,15 C-35,38 0,55 0,55 C0,55 35,38 35,15 C35,-10 10,-20 0,0 Z" fill="url(#heartRed)"/>
    <ellipse cx="-10" cy="5" rx="5" ry="3" fill="#FFF" opacity="0.7"/>
  </g>
  <g transform="translate(90, 56) scale(0.65)">
    <path d="M0,0 C-10,-20 -35,-10 -35,15 C-35,38 0,55 0,55 C0,55 35,38 35,15 C35,-10 10,-20 0,0 Z" fill="url(#heartRed)"/>
    <ellipse cx="-10" cy="5" rx="5" ry="3" fill="#FFF" opacity="0.7"/>
  </g>
  <!-- Cat Nose & Mouth -->
  <polygon points="64,78 59,73 69,73" fill="#E91E63"/>
  <path d="M54,82 Q64,88 64,80 Q64,88 74,82" stroke="#5D4037" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Whiskers -->
  <path d="M12,74 L40,78 M10,84 L38,82 M12,94 L40,86" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M116,74 L88,78 M118,84 L90,82 M116,94 L88,86" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'heart_fire',
    emoji1: '🔥',
    emoji2: '❤️',
    name: 'Heart on Fire',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#D50000"/>
      <stop offset="40%" stop-color="#FF6D00"/>
      <stop offset="75%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#FFF9C4"/>
    </linearGradient>
    <radialGradient id="heartBody" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FF1744"/>
      <stop offset="80%" stop-color="#C51162"/>
      <stop offset="100%" stop-color="#880E4F"/>
    </radialGradient>
  </defs>
  <!-- Background Flames -->
  <path d="M64,6 C80,30 96,25 98,50 C108,35 118,60 110,85 C125,60 115,100 95,115 C75,128 53,128 33,115 C13,100 3,60 18,85 C10,60 20,35 30,50 C32,25 48,30 64,6 Z" fill="url(#fireGrad)"/>
  <!-- Heart Foreground -->
  <g transform="translate(64, 76) scale(0.9)">
    <path d="M0,-24 C-16,-52 -56,-38 -56,-4 C-56,26 0,52 0,52 C0,52 56,26 56,-4 C56,-38 16,-52 0,-24 Z" fill="url(#heartBody)"/>
    <!-- Inner Flame on Heart -->
    <path d="M0,45 C-18,25 -28,5 -15,-10 C-2,5 0,-20 8,-5 C16,-20 25,-5 20,10 C32,25 18,35 0,45 Z" fill="url(#fireGrad)" opacity="0.9"/>
  </g>
</svg>`
  },
  {
    id: 'skull_crying',
    emoji1: '💀',
    emoji2: '😭',
    name: 'Dying of Laughter',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="boneGrad" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#BDBDBD"/>
    </radialGradient>
    <linearGradient id="tearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF"/>
      <stop offset="100%" stop-color="#0091EA"/>
    </linearGradient>
  </defs>
  <!-- Skull Cranium -->
  <path d="M28,60 C28,26 44,14 64,14 C84,14 100,26 100,60 C100,74 94,82 86,86 L86,104 L42,104 L42,86 C34,82 28,74 28,60 Z" fill="url(#boneGrad)"/>
  <!-- Teeth -->
  <path d="M46,92 L46,104 M55,92 L55,104 M64,92 L64,104 M73,92 L73,104 M82,92 L82,104" stroke="#424242" stroke-width="3" stroke-linecap="round"/>
  <!-- Nose Hole -->
  <path d="M64,68 L58,78 L70,78 Z" fill="#212121"/>
  <!-- Crying Eye Sockets with Tear Waterfalls -->
  <ellipse cx="44" cy="54" rx="14" ry="16" fill="#212121"/>
  <ellipse cx="84" cy="54" rx="14" ry="16" fill="#212121"/>
  <!-- Giant Streaming Waterfall Tears -->
  <path d="M36,58 C32,70 20,86 16,110 C14,122 34,124 38,110 C42,94 48,74 48,58 Z" fill="url(#tearGrad)"/>
  <path d="M92,58 C96,70 108,86 112,110 C114,122 94,124 90,110 C86,94 80,74 80,58 Z" fill="url(#tearGrad)"/>
</svg>`
  },
  {
    id: 'cowboy_dog',
    emoji1: '🤠',
    emoji2: '🐶',
    name: 'Sheriff Pup',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="dogFur" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="90%" stop-color="#FFB74D"/>
      <stop offset="100%" stop-color="#FFA726"/>
    </radialGradient>
    <radialGradient id="hatBrown" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#8D6E63"/>
      <stop offset="100%" stop-color="#4E342E"/>
    </radialGradient>
  </defs>
  <!-- Droopy Ears -->
  <path d="M26,60 C12,65 8,100 24,106 C36,110 40,85 36,65 Z" fill="#8D6E63"/>
  <path d="M102,60 C116,65 120,100 104,106 C92,110 88,85 92,65 Z" fill="#8D6E63"/>
  <!-- Dog Face -->
  <ellipse cx="64" cy="78" rx="42" ry="38" fill="url(#dogFur)"/>
  <!-- Eyes -->
  <circle cx="48" cy="74" r="6" fill="#212121"/>
  <circle cx="50" cy="72" r="2" fill="#FFF"/>
  <circle cx="80" cy="74" r="6" fill="#212121"/>
  <circle cx="82" cy="72" r="2" fill="#FFF"/>
  <!-- Muzzle & Nose -->
  <ellipse cx="64" cy="94" rx="20" ry="14" fill="#FFF8E1"/>
  <ellipse cx="64" cy="87" rx="8" ry="5" fill="#212121"/>
  <path d="M64,92 L64,98 M56,98 Q64,104 64,98 Q64,104 72,98" stroke="#212121" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Happy Tongue -->
  <path d="M60,99 Q64,110 68,99 Z" fill="#FF4081"/>
  <!-- Cowboy Hat -->
  <g transform="translate(0, -6)">
    <!-- Brim -->
    <path d="M12,48 C30,32 98,32 116,48 C122,54 100,52 64,52 C28,52 6,54 12,48 Z" fill="#5D4037"/>
    <!-- Crown -->
    <path d="M38,44 C36,20 46,14 64,20 C82,14 92,20 90,44 Z" fill="url(#hatBrown)"/>
    <!-- Hat Ribbon with Star -->
    <path d="M38,44 Q64,48 90,44 Q64,42 38,44 Z" fill="#FFD54F"/>
    <circle cx="64" cy="45" r="4" fill="#FFC107"/>
  </g>
</svg>`
  },
  {
    id: 'robot_heart',
    emoji1: '🤖',
    emoji2: '❤️',
    name: 'Lovestruck Bot',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="botMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CFD8DC"/>
      <stop offset="50%" stop-color="#90A4AE"/>
      <stop offset="100%" stop-color="#607D8B"/>
    </linearGradient>
    <radialGradient id="glowHeart" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="100%" stop-color="#C51162"/>
    </radialGradient>
  </defs>
  <!-- Antenna with Heart Bulb -->
  <line x1="64" y1="36" x2="64" y2="18" stroke="#78909C" stroke-width="4" stroke-linecap="round"/>
  <path d="M64,8 C61,2 53,2 53,7 C53,12 64,18 64,18 C64,18 75,12 75,7 C75,2 67,2 64,8 Z" fill="#FF1744"/>
  <!-- Ears / Bolts -->
  <rect x="18" y="58" width="8" height="20" rx="3" fill="#FFB300"/>
  <rect x="102" y="58" width="8" height="20" rx="3" fill="#FFB300"/>
  <!-- Head -->
  <rect x="24" y="34" width="80" height="70" rx="16" fill="url(#botMetal)" stroke="#455A64" stroke-width="3"/>
  <!-- Screen Eyes (Heart Monitors) -->
  <rect x="34" y="48" width="26" height="22" rx="6" fill="#212121"/>
  <rect x="68" y="48" width="26" height="22" rx="6" fill="#212121"/>
  <!-- Heart Shapes on Screens -->
  <path d="M47,53 C43,49 37,51 37,56 C37,62 47,67 47,67 C47,67 57,62 57,56 C57,51 51,49 47,53 Z" fill="url(#glowHeart)"/>
  <path d="M81,53 C77,49 71,51 71,56 C71,62 81,67 81,67 C81,67 91,62 91,56 C91,51 85,49 81,53 Z" fill="url(#glowHeart)"/>
  <!-- Mouth Screen with Digital Smile -->
  <rect x="42" y="80" width="44" height="14" rx="4" fill="#212121"/>
  <path d="M48,87 Q64,96 80,87" stroke="#00E676" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>`
  },
  {
    id: 'ghost_coffee',
    emoji1: '👻',
    emoji2: '☕',
    name: 'Spooky Brew',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="ghostWhite" cx="45%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#E8EAF6"/>
      <stop offset="100%" stop-color="#C5CAE9"/>
    </radialGradient>
  </defs>
  <!-- Ghost Body -->
  <path d="M64,16 C38,16 26,42 26,72 C26,104 22,118 36,114 C46,110 52,118 64,114 C76,118 82,110 92,114 C106,118 102,104 102,72 C102,42 90,16 64,16 Z" fill="url(#ghostWhite)"/>
  <!-- Ghost Eyes & Cheeks -->
  <ellipse cx="48" cy="46" rx="6" ry="8" fill="#1A237E"/>
  <ellipse cx="80" cy="46" rx="6" ry="8" fill="#1A237E"/>
  <circle cx="50" cy="44" r="2" fill="#FFF"/>
  <circle cx="82" cy="44" r="2" fill="#FFF"/>
  <ellipse cx="38" cy="56" rx="7" ry="4" fill="#FF80AB" opacity="0.6"/>
  <ellipse cx="90" cy="56" rx="7" ry="4" fill="#FF80AB" opacity="0.6"/>
  <path d="M58,54 Q64,62 70,54" stroke="#1A237E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Coffee Mug -->
  <g transform="translate(44, 68)">
    <rect x="0" y="8" width="40" height="30" rx="8" fill="#795548" stroke="#4E342E" stroke-width="2.5"/>
    <path d="M40,14 C48,14 48,32 40,32" stroke="#4E342E" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="10" rx="16" ry="4" fill="#3E2723"/>
    <!-- Steam -->
    <path d="M12,-2 Q16,-8 14,-14 M20,-4 Q24,-10 22,-16 M28,-2 Q32,-8 30,-14" stroke="#B0BEC5" stroke-width="2" stroke-linecap="round" fill="none"/>
  </g>
</svg>`
  },
  {
    id: 'avocado_cat',
    emoji1: '🥑',
    emoji2: '🐱',
    name: 'Avocado Kitty',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="avoFlesh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F4FF81"/>
      <stop offset="65%" stop-color="#C6FF00"/>
      <stop offset="100%" stop-color="#64DD17"/>
    </radialGradient>
    <radialGradient id="catPit" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#8D6E63"/>
      <stop offset="85%" stop-color="#5D4037"/>
      <stop offset="100%" stop-color="#3E2723"/>
    </radialGradient>
  </defs>
  <!-- Avocado Skin & Flesh -->
  <path d="M64,12 C44,12 30,34 30,52 C30,68 18,80 18,96 C18,114 38,124 64,124 C90,124 110,114 110,96 C110,80 98,68 98,52 C98,34 84,12 64,12 Z" fill="#33691E"/>
  <path d="M64,16 C47,16 34,36 34,54 C34,69 23,81 23,96 C23,111 41,120 64,120 C87,120 105,111 105,96 C105,81 94,69 94,54 C94,36 81,16 64,16 Z" fill="url(#avoFlesh)"/>
  <!-- Pit Cat Center -->
  <!-- Ears -->
  <polygon points="46,72 38,56 56,62" fill="#5D4037"/>
  <polygon points="82,72 90,56 72,62" fill="#5D4037"/>
  <!-- Face Circle -->
  <circle cx="64" cy="86" r="26" fill="url(#catPit)"/>
  <!-- Sleeping Happy Eyes -->
  <path d="M48,82 Q54,77 60,82" stroke="#FFCCBC" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M68,82 Q74,77 80,82" stroke="#FFCCBC" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Pink Nose & Cute Whiskers -->
  <polygon points="64,88 61,85 67,85" fill="#FF80AB"/>
  <path d="M38,86 L48,87 M38,91 L48,89" stroke="#FFCCBC" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M90,86 L80,87 M90,91 L80,89" stroke="#FFCCBC" stroke-width="1.8" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'pizza_rocket',
    emoji1: '🍕',
    emoji2: '🚀',
    name: 'Pizza Rocket',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="rocketFire" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF"/>
      <stop offset="40%" stop-color="#FF9100"/>
      <stop offset="100%" stop-color="#FF1744"/>
    </linearGradient>
  </defs>
  <!-- Flame Thrusters -->
  <path d="M48,102 Q64,128 64,126 Q64,128 80,102 Z" fill="url(#rocketFire)"/>
  <path d="M54,102 Q64,120 64,118 Q64,120 74,102 Z" fill="#FFEA00"/>
  <!-- Rocket Thruster Metal Base -->
  <rect x="46" y="96" width="36" height="8" rx="3" fill="#78909C" stroke="#37474F" stroke-width="2"/>
  <!-- Pizza Slice (Rocket Body) -->
  <polygon points="64,14 18,96 110,96" fill="#FFC107"/>
  <!-- Crust Base -->
  <path d="M14,96 Q64,102 114,96 C114,92 108,88 64,90 C20,88 14,92 14,96 Z" fill="#FFA000"/>
  <!-- Melted Cheese & Pepperoni Planets -->
  <circle cx="56" cy="46" r="8" fill="#D32F2F"/>
  <circle cx="58" cy="44" r="2" fill="#FFCDD2"/>
  <circle cx="76" cy="68" r="9" fill="#D32F2F"/>
  <circle cx="78" cy="66" r="2.5" fill="#FFCDD2"/>
  <circle cx="44" cy="76" r="7" fill="#D32F2F"/>
  <!-- Rocket Porthole Window -->
  <circle cx="64" cy="38" r="10" fill="#29B6F6" stroke="#ECEFF1" stroke-width="3"/>
  <path d="M58,34 Q64,30 70,34" stroke="#FFF" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`
  },
  {
    id: 'clown_balloon',
    emoji1: '🤡',
    emoji2: '🎈',
    name: 'Carnival Balloon',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="balloonRed" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FF8A80"/>
      <stop offset="40%" stop-color="#FF1744"/>
      <stop offset="100%" stop-color="#B71C1C"/>
    </radialGradient>
  </defs>
  <!-- Balloon String -->
  <path d="M64,108 Q60,118 68,126" stroke="#B0BEC5" stroke-width="2" fill="none"/>
  <!-- Knot -->
  <polygon points="64,102 58,108 70,108" fill="#D50000"/>
  <!-- Clown Hair Tuft Side Bunches -->
  <circle cx="20" cy="52" r="14" fill="#00E5FF"/>
  <circle cx="24" cy="40" r="10" fill="#00E5FF"/>
  <circle cx="108" cy="52" r="14" fill="#00E5FF"/>
  <circle cx="104" cy="40" r="10" fill="#00E5FF"/>
  <!-- Round Balloon Body -->
  <ellipse cx="64" cy="56" rx="46" ry="48" fill="url(#balloonRed)"/>
  <!-- Gloss highlight -->
  <ellipse cx="44" cy="32" rx="10" ry="16" transform="rotate(-30, 44, 32)" fill="#FFF" opacity="0.4"/>
  <!-- Clown Face Paint: Eyes with Blue Triangles -->
  <polygon points="44,36 49,48 39,48" fill="#2979FF"/>
  <polygon points="84,36 89,48 79,48" fill="#2979FF"/>
  <circle cx="44" cy="54" r="5" fill="#212121"/>
  <circle cx="84" cy="54" r="5" fill="#212121"/>
  <!-- Big Red Nose -->
  <circle cx="64" cy="65" r="9" fill="#FF1744" stroke="#FFF" stroke-width="1.5"/>
  <!-- Clown Big Smile -->
  <path d="M38,72 Q64,96 90,72" stroke="#FFF" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M42,73 Q64,92 86,73" stroke="#D50000" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>`
  },
  {
    id: 'sparkle_unicorn',
    emoji1: '🦄',
    emoji2: '✨',
    name: 'Astral Unicorn',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9C4"/>
      <stop offset="50%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#FF8F00"/>
    </linearGradient>
  </defs>
  <!-- Mane (Pastel Rainbow) -->
  <path d="M84,32 C96,44 110,65 104,96 C98,90 92,80 88,72 C86,60 84,45 84,32 Z" fill="#E040FB"/>
  <path d="M78,38 C90,52 100,75 94,106 C90,94 84,85 80,78 Z" fill="#00E5FF"/>
  <!-- Golden Spiral Horn -->
  <polygon points="46,42 22,8 58,34" fill="url(#hornGrad)"/>
  <!-- Unicorn Head -->
  <path d="M42,42 C40,40 50,30 68,34 C82,38 88,54 84,72 C80,90 68,98 52,98 C40,98 28,88 32,74 C34,66 44,60 42,42 Z" fill="#FFFFFF"/>
  <!-- Nostril & Muzzle Pink -->
  <ellipse cx="36" cy="82" rx="8" ry="10" fill="#FF80AB" opacity="0.5"/>
  <circle cx="34" cy="80" r="2.5" fill="#C2185B"/>
  <!-- Anime Eye -->
  <ellipse cx="60" cy="58" rx="6" ry="8" fill="#7C4DFF"/>
  <circle cx="62" cy="55" r="2.5" fill="#FFF"/>
  <!-- Four-point Astral Sparkles around -->
  <g transform="translate(100, 20)">
    <path d="M0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Q0,0 0,-12 Z" fill="#FFD700"/>
  </g>
  <g transform="translate(18, 90)">
    <path d="M0,-8 Q0,0 8,0 Q0,0 0,8 Q0,0 -8,0 Q0,0 0,-8 Z" fill="#00E5FF"/>
  </g>
  <g transform="translate(108, 94)">
    <path d="M0,-8 Q0,0 8,0 Q0,0 0,8 Q0,0 -8,0 Q0,0 0,-8 Z" fill="#E040FB"/>
  </g>
</svg>`
  },
  {
    id: 'frog_tea',
    emoji1: '🐸',
    emoji2: '☕',
    name: 'Tea Sipper',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="frogGreen" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#AEEA00"/>
      <stop offset="85%" stop-color="#7CB342"/>
      <stop offset="100%" stop-color="#558B2F"/>
    </radialGradient>
  </defs>
  <!-- Frog Big Eye Bulges -->
  <circle cx="38" cy="40" r="20" fill="url(#frogGreen)"/>
  <circle cx="90" cy="40" r="20" fill="url(#frogGreen)"/>
  <!-- Eyes -->
  <circle cx="38" cy="40" r="12" fill="#FFFFFF"/>
  <circle cx="90" cy="40" r="12" fill="#FFFFFF"/>
  <ellipse cx="40" cy="40" rx="6" ry="8" fill="#212121"/>
  <ellipse cx="88" cy="40" rx="6" ry="8" fill="#212121"/>
  <!-- Frog Head -->
  <ellipse cx="64" cy="68" rx="52" ry="38" fill="url(#frogGreen)"/>
  <!-- Smug Smile -->
  <path d="M34,74 Q64,90 94,74" stroke="#33691E" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Tea Cup in Hand -->
  <g transform="translate(48, 80)">
    <rect x="0" y="4" width="32" height="24" rx="6" fill="#FAFAFA" stroke="#9E9E9E" stroke-width="2"/>
    <path d="M32,8 C38,8 38,20 32,20" stroke="#9E9E9E" stroke-width="2.5" fill="none"/>
    <ellipse cx="16" cy="6" rx="13" ry="3" fill="#795548"/>
    <!-- Teabag string & tag -->
    <path d="M16,6 L10,18" stroke="#D7CCC8" stroke-width="1.5"/>
    <rect x="6" y="18" width="8" height="8" rx="1" fill="#FFEB3B"/>
    <!-- Steam -->
    <path d="M10,-4 Q14,-10 12,-16 M20,-4 Q24,-10 22,-16" stroke="#B0BEC5" stroke-width="2" stroke-linecap="round" fill="none"/>
  </g>
</svg>`
  },
  {
    id: 'party_cake',
    emoji1: '🥳',
    emoji2: '🎂',
    name: 'Party Cake',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="partyFace" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFEB3B"/>
      <stop offset="90%" stop-color="#FBC02D"/>
      <stop offset="100%" stop-color="#F57F17"/>
    </radialGradient>
  </defs>
  <!-- Main Face -->
  <circle cx="64" cy="74" r="44" fill="url(#partyFace)"/>
  <!-- Party Horn in Mouth -->
  <g transform="translate(68, 86)">
    <path d="M0,0 L36,12 L38,-4 Z" fill="#E91E63"/>
    <circle cx="40" cy="4" r="6" fill="#00E5FF"/>
  </g>
  <!-- Eyes & Cheeks -->
  <path d="M40,64 Q48,56 56,64" stroke="#5D4037" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <path d="M72,64 Q80,56 88,64" stroke="#5D4037" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="36" cy="76" rx="8" ry="5" fill="#FF5252" opacity="0.6"/>
  <ellipse cx="92" cy="76" rx="8" ry="5" fill="#FF5252" opacity="0.6"/>
  <!-- Birthday Cake Hat on Top -->
  <g transform="translate(36, 6)">
    <!-- Base tier -->
    <rect x="6" y="24" width="44" height="16" rx="4" fill="#F8BBD0"/>
    <path d="M6,24 Q16,28 26,24 Q36,28 50,24" stroke="#E91E63" stroke-width="3" fill="none"/>
    <!-- Top tier -->
    <rect x="14" y="14" width="28" height="12" rx="3" fill="#FFFFFF"/>
    <!-- Candles -->
    <rect x="22" y="6" width="3" height="8" fill="#00E5FF"/>
    <rect x="31" y="6" width="3" height="8" fill="#FFEB3B"/>
    <!-- Flames -->
    <circle cx="23.5" cy="4" r="2.5" fill="#FF5722"/>
    <circle cx="32.5" cy="4" r="2.5" fill="#FF5722"/>
  </g>
  <!-- Confetti bits -->
  <circle cx="20" cy="38" r="3" fill="#00E5FF"/>
  <rect x="98" y="32" width="5" height="5" transform="rotate(45, 98, 32)" fill="#E91E63"/>
  <rect x="14" y="80" width="6" height="3" fill="#76FF03"/>
</svg>`
  },
  {
    id: 'panda_bamboo',
    emoji1: '🐼',
    emoji2: '🎋',
    name: 'Zen Panda',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Panda Ears -->
  <circle cx="32" cy="34" r="16" fill="#212121"/>
  <circle cx="96" cy="34" r="16" fill="#212121"/>
  <!-- Panda Head -->
  <ellipse cx="64" cy="70" rx="48" ry="44" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="2"/>
  <!-- Eye Patches -->
  <ellipse cx="44" cy="62" rx="14" ry="18" transform="rotate(-15, 44, 62)" fill="#212121"/>
  <ellipse cx="84" cy="62" rx="14" ry="18" transform="rotate(15, 84, 62)" fill="#212121"/>
  <!-- Eyes -->
  <circle cx="44" cy="62" r="5" fill="#FFFFFF"/>
  <circle cx="44" cy="62" r="3" fill="#000000"/>
  <circle cx="84" cy="62" r="5" fill="#FFFFFF"/>
  <circle cx="84" cy="62" r="3" fill="#000000"/>
  <!-- Nose & Mouth -->
  <ellipse cx="64" cy="78" rx="8" ry="5" fill="#212121"/>
  <path d="M58,84 Q64,90 70,84" stroke="#212121" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Bamboo Shoot in Mouth -->
  <g transform="translate(18, 70) rotate(-20)">
    <rect x="0" y="8" width="60" height="10" rx="4" fill="#64DD17" stroke="#33691E" stroke-width="2"/>
    <line x1="20" y1="8" x2="20" y2="18" stroke="#33691E" stroke-width="2"/>
    <line x1="40" y1="8" x2="40" y2="18" stroke="#33691E" stroke-width="2"/>
    <!-- Bamboo Leaves -->
    <path d="M56,8 Q70,-4 76,2 Q68,14 56,12 Z" fill="#76FF03"/>
    <path d="M38,6 Q50,-6 54,0 Q46,10 38,8 Z" fill="#76FF03"/>
  </g>
</svg>`
  },
  {
    id: 'monkey_banana',
    emoji1: '🐵',
    emoji2: '🍌',
    name: 'Banana Chimp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Ears -->
  <circle cx="22" cy="64" r="16" fill="#795548"/>
  <circle cx="22" cy="64" r="10" fill="#FFCCBC"/>
  <circle cx="106" cy="64" r="16" fill="#795548"/>
  <circle cx="106" cy="64" r="10" fill="#FFCCBC"/>
  <!-- Head -->
  <circle cx="64" cy="66" r="42" fill="#795548"/>
  <!-- Face Mask -->
  <ellipse cx="50" cy="58" rx="16" ry="18" fill="#FFCCBC"/>
  <ellipse cx="78" cy="58" rx="16" ry="18" fill="#FFCCBC"/>
  <ellipse cx="64" cy="78" rx="28" ry="20" fill="#FFCCBC"/>
  <!-- Eyes -->
  <circle cx="50" cy="58" r="5" fill="#212121"/>
  <circle cx="78" cy="58" r="5" fill="#212121"/>
  <!-- Nostrils & Grin -->
  <circle cx="60" cy="74" r="2" fill="#5D4037"/>
  <circle cx="68" cy="74" r="2" fill="#5D4037"/>
  <path d="M50,84 Q64,96 78,84" stroke="#5D4037" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Banana Hat on Head -->
  <g transform="translate(24, 6) rotate(15)">
    <path d="M0,24 C20,6 60,6 80,30 C60,18 20,18 0,24 Z" fill="#FFEB3B" stroke="#F57F17" stroke-width="2.5"/>
    <polygon points="78,28 86,34 82,36" fill="#795548"/>
  </g>
</svg>`
  },
  {
    id: 'strawberry_icecream',
    emoji1: '🍦',
    emoji2: '🍓',
    name: 'Berry Swirl Sundae',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Waffle Cone -->
  <polygon points="64,124 34,70 94,70" fill="#FFB74D"/>
  <path d="M44,70 L74,120 M54,70 L84,110 M64,70 L90,95 M84,70 L54,120 M74,70 L44,110 M64,70 L38,95" stroke="#F57C00" stroke-width="1.5"/>
  <!-- Soft Serve Swirl (Pink Vanilla Swirl) -->
  <path d="M30,70 C24,60 38,48 48,50 C44,40 56,32 64,30 C72,32 84,40 80,50 C90,48 104,60 98,70 Z" fill="#F8BBD0"/>
  <path d="M42,54 Q64,62 86,54" stroke="#EC407A" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Strawberry on Top -->
  <g transform="translate(64, 26) scale(0.7)">
    <path d="M0,0 C-18,-8 -24,-30 0,-34 C24,-30 18,-8 0,0 Z" fill="#E53935"/>
    <!-- Strawberry Seeds -->
    <circle cx="-6" cy="-20" r="1.5" fill="#FFF9C4"/>
    <circle cx="6" cy="-20" r="1.5" fill="#FFF9C4"/>
    <circle cx="0" cy="-12" r="1.5" fill="#FFF9C4"/>
    <!-- Strawberry Leaves -->
    <polygon points="0,-34 -12,-40 -4,-34 0,-44 4,-34 12,-40 0,-34" fill="#43A047"/>
  </g>
  <!-- Sprinkles -->
  <rect x="42" y="60" width="4" height="2" transform="rotate(30, 42, 60)" fill="#00E5FF"/>
  <rect x="78" y="62" width="4" height="2" transform="rotate(-20, 78, 62)" fill="#FFD600"/>
  <rect x="62" y="52" width="4" height="2" transform="rotate(45, 62, 52)" fill="#76FF03"/>
</svg>`
  },
  {
    id: 'alien_saucer',
    emoji1: '👽',
    emoji2: '🛸',
    name: 'Cosmic Pilot',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="saucerGlass" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#E0F7FA"/>
      <stop offset="70%" stop-color="#80DEEA"/>
      <stop offset="100%" stop-color="#26C6DA"/>
    </radialGradient>
  </defs>
  <!-- Saucer Glass Cockpit Dome -->
  <ellipse cx="64" cy="54" rx="34" ry="32" fill="url(#saucerGlass)" opacity="0.85"/>
  <!-- Cute Alien inside Dome -->
  <g transform="translate(64, 52) scale(0.6)">
    <!-- Alien Head -->
    <path d="M0,-30 C-26,-30 -34,-6 -22,18 C-14,32 0,38 0,38 C0,38 14,32 22,18 C34,-6 26,-30 0,-30 Z" fill="#69F0AE"/>
    <!-- Giant Slanted Black Eyes -->
    <ellipse cx="-12" cy="-2" rx="8" ry="14" transform="rotate(-25, -12, -2)" fill="#212121"/>
    <circle cx="-14" cy="-5" r="3" fill="#FFF"/>
    <ellipse cx="12" cy="-2" rx="8" ry="14" transform="rotate(25, 12, -2)" fill="#212121"/>
    <circle cx="10" cy="-5" r="3" fill="#FFF"/>
  </g>
  <!-- Flying Saucer Disc Metal Body -->
  <ellipse cx="64" cy="80" rx="56" ry="18" fill="#78909C" stroke="#37474F" stroke-width="3"/>
  <ellipse cx="64" cy="78" rx="52" ry="14" fill="#B0BEC5"/>
  <!-- Glowing Neon Signal Lights -->
  <circle cx="24" cy="82" r="4" fill="#FFEA00"/>
  <circle cx="44" cy="86" r="4" fill="#00E5FF"/>
  <circle cx="64" cy="88" r="4" fill="#FF1744"/>
  <circle cx="84" cy="86" r="4" fill="#00E5FF"/>
  <circle cx="104" cy="82" r="4" fill="#FFEA00"/>
</svg>`
  },
  {
    id: 'lion_king',
    emoji1: '🦁',
    emoji2: '👑',
    name: 'Royal Lion',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Lion Big Fluffy Mane -->
  <circle cx="64" cy="74" r="50" fill="#E65100"/>
  <!-- Ears -->
  <circle cx="34" cy="46" r="10" fill="#FFA726"/>
  <circle cx="94" cy="46" r="10" fill="#FFA726"/>
  <!-- Face -->
  <circle cx="64" cy="76" r="36" fill="#FFA726"/>
  <!-- Eyes -->
  <circle cx="50" cy="72" r="5" fill="#212121"/>
  <circle cx="52" cy="70" r="1.5" fill="#FFF"/>
  <circle cx="78" cy="72" r="5" fill="#212121"/>
  <circle cx="80" cy="70" r="1.5" fill="#FFF"/>
  <!-- Muzzle & Whiskers -->
  <ellipse cx="58" cy="86" rx="8" ry="6" fill="#FFE082"/>
  <ellipse cx="70" cy="86" rx="8" ry="6" fill="#FFE082"/>
  <polygon points="64,82 58,77 70,77" fill="#8D6E63"/>
  <!-- Golden Royal Crown -->
  <g transform="translate(34, 12)">
    <polygon points="0,28 8,6 30,20 52,6 60,28" fill="#FFD600" stroke="#FF8F00" stroke-width="2.5"/>
    <rect x="0" y="24" width="60" height="8" rx="2" fill="#FFA000"/>
    <!-- Jewels on Crown -->
    <circle cx="8" cy="6" r="3" fill="#D50000"/>
    <circle cx="30" cy="20" r="3" fill="#00B0FF"/>
    <circle cx="52" cy="6" r="3" fill="#00E676"/>
    <circle cx="30" cy="28" r="2.5" fill="#E040FB"/>
  </g>
</svg>`
  },
  {
    id: 'koala_leaf',
    emoji1: '🐨',
    emoji2: '🌿',
    name: 'Cozy Koala',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Fluffy Koala Ears -->
  <circle cx="26" cy="46" r="20" fill="#B0BEC5"/>
  <circle cx="26" cy="46" r="12" fill="#ECEFF1"/>
  <circle cx="102" cy="46" r="20" fill="#B0BEC5"/>
  <circle cx="102" cy="46" r="12" fill="#ECEFF1"/>
  <!-- Head -->
  <ellipse cx="64" cy="70" rx="42" ry="36" fill="#CFD8DC"/>
  <!-- Eyes -->
  <circle cx="46" cy="66" r="5" fill="#212121"/>
  <circle cx="48" cy="64" r="1.5" fill="#FFF"/>
  <circle cx="82" cy="66" r="5" fill="#212121"/>
  <circle cx="84" cy="64" r="1.5" fill="#FFF"/>
  <!-- Big Oval Koala Nose -->
  <ellipse cx="64" cy="74" rx="12" ry="18" fill="#37474F"/>
  <ellipse cx="62" cy="70" rx="3" ry="5" fill="#78909C"/>
  <!-- Eucalyptus Branch Hugged -->
  <g transform="translate(18, 76) rotate(-15)">
    <path d="M0,20 Q30,10 60,0" stroke="#8D6E63" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="8" rx="12" ry="6" transform="rotate(-30, 20, 8)" fill="#43A047"/>
    <ellipse cx="45" cy="2" rx="12" ry="6" transform="rotate(-15, 45, 2)" fill="#66BB6A"/>
    <ellipse cx="60" cy="-6" rx="10" ry="5" transform="rotate(10, 60, -6)" fill="#81C784"/>
  </g>
</svg>`
  },
  {
    id: 'rainbow_cloud',
    emoji1: '🌈',
    emoji2: '🌧️',
    name: 'Sunshower Cloud',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="rainbowStripes" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF1744"/>
      <stop offset="25%" stop-color="#FF9100"/>
      <stop offset="50%" stop-color="#FFEA00"/>
      <stop offset="75%" stop-color="#00E676"/>
      <stop offset="100%" stop-color="#2979FF"/>
    </linearGradient>
  </defs>
  <!-- Rainbow Raindrops Falling -->
  <ellipse cx="32" cy="106" rx="3.5" ry="7" fill="#FF1744"/>
  <ellipse cx="48" cy="112" rx="3.5" ry="7" fill="#FF9100"/>
  <ellipse cx="64" cy="106" rx="3.5" ry="7" fill="#FFEA00"/>
  <ellipse cx="80" cy="112" rx="3.5" ry="7" fill="#00E676"/>
  <ellipse cx="96" cy="106" rx="3.5" ry="7" fill="#2979FF"/>
  <!-- Fluffy Cloud -->
  <path d="M38,82 C22,82 14,68 24,56 C20,40 38,32 50,38 C58,24 84,24 92,40 C106,36 116,50 110,64 C120,76 108,82 98,82 Z" fill="#ECEFF1" stroke="#CFD8DC" stroke-width="2"/>
  <!-- Rainbow Arch Crown on Top of Cloud -->
  <path d="M38,44 C38,20 90,20 90,44" stroke="url(#rainbowStripes)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Happy Face on Cloud -->
  <path d="M48,60 Q52,56 56,60" stroke="#546E7A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M72,60 Q76,56 80,60" stroke="#546E7A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M58,68 Q64,74 70,68" stroke="#546E7A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="44" cy="65" rx="4" ry="2.5" fill="#FF80AB" opacity="0.6"/>
  <ellipse cx="84" cy="65" rx="4" ry="2.5" fill="#FF80AB" opacity="0.6"/>
</svg>`
  },
  {
    id: 'pumpkin_ghost',
    emoji1: '🎃',
    emoji2: '👻',
    name: 'Jack-o-Ghost',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Ghost Popping Out of Pumpkin -->
  <path d="M64,8 C50,8 42,24 42,44 C42,56 50,60 64,60 C78,60 86,56 86,44 C86,24 78,8 64,8 Z" fill="#FFFFFF"/>
  <circle cx="56" cy="28" r="3.5" fill="#212121"/>
  <circle cx="72" cy="28" r="3.5" fill="#212121"/>
  <ellipse cx="64" cy="38" rx="4" ry="6" fill="#212121"/>
  <!-- Ghost Floating Arms -->
  <path d="M44,40 C34,36 30,46 42,48" fill="#FFFFFF"/>
  <path d="M84,40 C94,36 98,46 86,48" fill="#FFFFFF"/>
  <!-- Jack-o-Lantern Pumpkin Base -->
  <ellipse cx="64" cy="84" rx="48" ry="38" fill="#FF6D00"/>
  <ellipse cx="64" cy="84" rx="28" ry="38" fill="#FF9100"/>
  <!-- Carved Glowing Yellow Eyes & Tooth Grin -->
  <polygon points="46,74 38,84 54,84" fill="#FFEA00"/>
  <polygon points="82,74 74,84 90,84" fill="#FFEA00"/>
  <polygon points="64,86 60,92 68,92" fill="#FFEA00"/>
  <path d="M42,98 L50,104 L58,98 L64,104 L70,98 L78,104 L86,98 Q64,116 42,98 Z" fill="#FFEA00"/>
</svg>`
  },
  {
    id: 'teddy_heart',
    emoji1: '🧸',
    emoji2: '💖',
    name: 'Cuddle Bear',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="pinkGlow" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF4081"/>
      <stop offset="100%" stop-color="#C2185B"/>
    </radialGradient>
  </defs>
  <!-- Teddy Ears -->
  <circle cx="34" cy="32" r="16" fill="#8D6E63"/>
  <circle cx="34" cy="32" r="9" fill="#D7CCC8"/>
  <circle cx="94" cy="32" r="16" fill="#8D6E63"/>
  <circle cx="94" cy="32" r="9" fill="#D7CCC8"/>
  <!-- Teddy Head -->
  <circle cx="64" cy="56" r="36" fill="#8D6E63"/>
  <!-- Eyes -->
  <circle cx="50" cy="50" r="4.5" fill="#212121"/>
  <circle cx="52" cy="48" r="1.5" fill="#FFF"/>
  <circle cx="78" cy="50" r="4.5" fill="#212121"/>
  <circle cx="80" cy="48" r="1.5" fill="#FFF"/>
  <!-- Muzzle -->
  <ellipse cx="64" cy="64" rx="14" ry="10" fill="#D7CCC8"/>
  <ellipse cx="64" cy="60" rx="6" ry="4" fill="#3E2723"/>
  <path d="M64,64 L64,68 M58,68 Q64,72 64,68 Q64,72 70,68" stroke="#3E2723" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Bear Arms Holding Big Sparkling Heart -->
  <g transform="translate(64, 94)">
    <!-- Big Heart -->
    <path d="M0,-14 C-14,-34 -44,-24 -44,-2 C-44,22 0,38 0,38 C0,38 44,22 44,-2 C44,-24 14,-34 0,-14 Z" fill="url(#pinkGlow)"/>
    <!-- Sparkle Stars -->
    <path d="M-18,-8 Q-18,0 -10,0 Q-18,0 -18,8 Q-18,0 -26,0 Q-18,0 -18,-8 Z" fill="#FFF"/>
    <path d="M18,12 Q18,18 24,18 Q18,18 18,24 Q18,18 12,18 Q18,18 18,12 Z" fill="#FFF"/>
  </g>
  <!-- Paws Clasping Heart -->
  <circle cx="28" cy="94" r="10" fill="#8D6E63"/>
  <circle cx="100" cy="94" r="10" fill="#8D6E63"/>
</svg>`
  },
  {
    id: 'sleepy_coffee',
    emoji1: '☕',
    emoji2: '🥱',
    name: 'Monday Morning',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Coffee Mug Body -->
  <rect x="24" y="44" width="68" height="64" rx="18" fill="#90A4AE" stroke="#455A64" stroke-width="3"/>
  <!-- Mug Handle -->
  <path d="M92,56 C112,56 112,96 92,96" stroke="#455A64" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Mug Rim & Steaming Coffee Liquid -->
  <ellipse cx="58" cy="44" rx="34" ry="10" fill="#4E342E" stroke="#455A64" stroke-width="3"/>
  <!-- Sleepy Droopy Eyes -->
  <path d="M42,66 Q48,60 54,66" stroke="#263238" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M68,66 Q74,60 80,66" stroke="#263238" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Giant Yawning Mouth (Tired 'O') -->
  <ellipse cx="61" cy="84" rx="12" ry="16" fill="#212121"/>
  <path d="M55,90 Q61,96 67,90" stroke="#E91E63" stroke-width="2" fill="none"/>
  <!-- Floating Zzz -->
  <g fill="#78909C" font-family="sans-serif" font-weight="bold">
    <text x="74" y="32" font-size="14">z</text>
    <text x="86" y="22" font-size="18">Z</text>
    <text x="100" y="12" font-size="22">Z</text>
  </g>
</svg>`
  },
  {
    id: 'avocado_taco',
    emoji1: '🌮',
    emoji2: '🥑',
    name: 'Guac Fiesta Taco',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Folded Crispy Taco Shell -->
  <path d="M14,84 C14,40 44,20 88,20 C106,20 114,32 114,46 C114,94 64,106 14,84 Z" fill="#FFA726" stroke="#F57C00" stroke-width="2.5"/>
  <!-- Filling: Meat, Shredded Lettuce, Cheddar, Tomato -->
  <path d="M30,76 C40,50 64,36 96,36 C86,60 60,78 30,76 Z" fill="#5D4037"/>
  <path d="M36,68 Q60,40 98,42" stroke="#76FF03" stroke-width="8" stroke-linecap="round" fill="none"/>
  <circle cx="58" cy="52" r="6" fill="#E53935"/>
  <circle cx="82" cy="46" r="5" fill="#E53935"/>
  <rect x="44" y="58" width="8" height="3" fill="#FFEA00" transform="rotate(30, 44, 58)"/>
  <rect x="70" y="54" width="8" height="3" fill="#FFEA00" transform="rotate(-20, 70, 54)"/>
  <!-- Avocado Half Topping -->
  <g transform="translate(68, 62) rotate(-15) scale(0.65)">
    <path d="M30,6 C18,6 10,20 10,34 C10,48 4,54 4,64 C4,76 18,84 30,84 C42,84 56,76 56,64 C56,54 50,48 50,34 C50,20 42,6 30,6 Z" fill="#33691E"/>
    <path d="M30,10 C20,10 14,22 14,34 C14,47 8,53 8,64 C8,74 20,80 30,80 C40,80 52,74 52,64 C52,53 46,47 46,34 C46,22 40,10 30,10 Z" fill="#CCFF90"/>
    <circle cx="30" cy="58" r="14" fill="#6D4C41"/>
  </g>
</svg>`
  },
  {
    id: 'cool_fire',
    emoji1: '😎',
    emoji2: '🔥',
    name: 'Fire Shades',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="flameBack" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#FFEA00"/>
      <stop offset="40%" stop-color="#FF6D00"/>
      <stop offset="100%" stop-color="#D50000"/>
    </radialGradient>
  </defs>
  <!-- Blazing Background Flames -->
  <path d="M64,6 C76,26 94,22 96,44 C108,30 118,52 110,76 C124,54 116,92 98,106 C78,122 50,122 30,106 C12,92 4,54 18,76 C10,52 20,30 32,44 C34,22 52,26 64,6 Z" fill="url(#flameBack)"/>
  <!-- Cool Yellow Face -->
  <circle cx="64" cy="74" r="40" fill="#FFD54F" stroke="#FFA000" stroke-width="2"/>
  <!-- Smug Smile -->
  <path d="M48,88 Q64,102 80,88" stroke="#5D4037" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Dark Black Sunglasses with White Glare -->
  <g transform="translate(26, 56)">
    <!-- Left Lens -->
    <path d="M0,0 L32,0 C34,16 28,26 14,26 C2,26 -2,16 0,0 Z" fill="#212121"/>
    <line x1="6" y1="4" x2="20" y2="20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <!-- Bridge -->
    <rect x="30" y="2" width="16" height="4" fill="#212121"/>
    <!-- Right Lens -->
    <path d="M44,0 L76,0 C78,16 74,26 62,26 C50,26 42,16 44,0 Z" fill="#212121"/>
    <line x1="50" y1="4" x2="64" y2="20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  </g>
</svg>`
  },
  {
    id: 'sparkle_heart',
    emoji1: '✨',
    emoji2: '❤️',
    name: 'Glimmering Heart',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="crystalHeart" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="50%" stop-color="#E53935"/>
      <stop offset="85%" stop-color="#B71C1C"/>
      <stop offset="100%" stop-color="#7F0000"/>
    </radialGradient>
  </defs>
  <!-- Radiant Faceted Heart -->
  <g transform="translate(64, 68)">
    <path d="M0,-28 C-20,-60 -68,-42 -68,-4 C-68,34 0,60 0,60 C0,60 68,34 68,-4 C68,-42 20,-60 0,-28 Z" fill="url(#crystalHeart)"/>
    <!-- Crystal Facet Highlights -->
    <path d="M0,-28 L-24,-4 L0,20 L24,-4 Z" fill="#FFFFFF" opacity="0.25"/>
    <path d="M-60,-4 L-24,-4 L0,-28 Z" fill="#FFFFFF" opacity="0.18"/>
    <path d="M60,-4 L24,-4 L0,-28 Z" fill="#FFFFFF" opacity="0.18"/>
    <path d="M-40,-20 Q-28,-36 -12,-30" stroke="#FFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  </g>
  <!-- Sparkling Four-Point Stars -->
  <g transform="translate(98, 22)">
    <path d="M0,-14 Q0,0 14,0 Q0,0 0,14 Q0,0 -14,0 Q0,0 0,-14 Z" fill="#FFD700"/>
  </g>
  <g transform="translate(18, 40)">
    <path d="M0,-10 Q0,0 10,0 Q0,0 0,10 Q0,0 -10,0 Q0,0 0,-10 Z" fill="#FFEB3B"/>
  </g>
  <g transform="translate(22, 100)">
    <path d="M0,-8 Q0,0 8,0 Q0,0 0,8 Q0,0 -8,0 Q0,0 0,-8 Z" fill="#00E5FF"/>
  </g>
  <g transform="translate(108, 92)">
    <path d="M0,-10 Q0,0 10,0 Q0,0 0,10 Q0,0 -10,0 Q0,0 0,-10 Z" fill="#FF4081"/>
  </g>
</svg>`
  }
];

console.log(`Generating ${BLENDS.length} optimized transparent WebP emoji kitchen blends...`);

let totalSize = 0;
for (const b of BLENDS) {
  const tmpSvg = path.join('/tmp', `blend_${b.id}.svg`);
  const webpPath = path.join(outDir, `${b.id}.webp`);
  
  fs.writeFileSync(tmpSvg, b.svg.trim());
  
  // Convert via ffmpeg to transparent WebP (bgra progressive, optimized size)
  execSync(`ffmpeg -y -i ${tmpSvg} -c:v libwebp -lossless 0 -qscale 90 ${webpPath} 2>/dev/null`);
  
  const sz = fs.statSync(webpPath).size;
  totalSize += sz;
  console.log(`✓ ${b.id}.webp: ${b.emoji1} + ${b.emoji2} = ${b.name} (${sz} bytes)`);
}

console.log(`\nGenerated ${BLENDS.length} blends successfully! Total size: ${(totalSize / 1024).toFixed(1)} KB`);
