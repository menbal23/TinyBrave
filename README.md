# TinyBrave

A retro pixel-style 2D turn-based RPG starter built with **Phaser 3**, **TypeScript**, and **Vite**.

Explore a tile-based world, move your hero with arrow keys or WASD, and press **Space** to jump into a turn-based battle!

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- npm v9 or newer

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build Locally

```bash
npm run preview
```

---

## 🎮 Controls

| Key                        | Action                 |
|----------------------------|------------------------|
| Arrow Keys / WASD          | Move player            |
| Space                      | Enter Battle           |
| Esc (in Battle)            | Return to Map          |
| Arrow Keys (in Battle)     | Select action          |
| Space / Enter (in Battle)  | Confirm action         |

---

## 📁 Project Structure

```
TinyBrave/
├── .github/workflows/ci.yml   # CI + GitHub Pages deploy
├── public/
│   └── assets/placeholder/    # Placeholder pixel-art sprites
│       ├── player.png         # 64×64 spritesheet (4×4 frames)
│       └── tileset.png        # 64×16 tileset (4 tiles × 16 px)
├── src/
│   ├── main.ts                # Phaser game bootstrap
│   └── scenes/
│       ├── BootScene.ts       # Asset loading + animation definitions
│       ├── MapScene.ts        # Tile-based world + player movement
│       └── BattleScene.ts     # Turn-based battle skeleton
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.cjs
└── .prettierrc
```

---

## 🛠 Scripts

| Command           | Description                    |
|-------------------|-------------------------------|
| `npm run dev`     | Start dev server (port 3000)  |
| `npm run build`   | TypeScript check + Vite build |
| `npm run preview` | Preview production build      |
| `npm run lint`    | ESLint                        |
| `npm run format`  | Prettier format               |

---

## 🗺 Scene Overview

- **BootScene** — Loads all assets and defines sprite animations, then launches MapScene.
- **MapScene** — Renders a 20×15 tile map with 4-directional player movement, camera follow, and a [SPACE] trigger to enter battle.
- **BattleScene** — Skeleton turn-based battle UI with Attack, Magic, Item, and Run actions. Returns to the map when battle ends.

---

## 📜 License

MIT — see [LICENSE](LICENSE).
