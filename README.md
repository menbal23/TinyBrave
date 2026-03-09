# TinyBrave

A retro pixel-style 2D turn-based RPG starter built with **Phaser 3** and **TypeScript**, bundled by **Vite**.

## Features

- Top-down MapScene with programmatic tilemap
- 4-directional player movement (Arrow keys or WASD)
- Camera follows player, clamped to map bounds
- Press **SPACE** to transition to BattleScene
- Press **ESC** in BattleScene to return to map
- Pixel-art rendering (`pixelArt: true`)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (hot-reload)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint on `src/` |
| `npm run format` | Format `src/` with Prettier |

## Project Structure

```
TinyBrave/
├── src/
│   ├── main.ts            # Phaser game bootstrap
│   ├── scenes/
│   │   ├── BootScene.ts   # Asset preloading
│   │   ├── MapScene.ts    # Overworld map + player movement
│   │   └── BattleScene.ts # Turn-based battle (skeleton)
│   └── assets/
│       ├── player.png     # Placeholder player sprite
│       └── tiles.png      # Placeholder tileset
├── public/
│   └── assets/            # Static assets served by Vite
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Branch Protection

It is recommended to create a branch protection ruleset named **"protect-main"** on the `main` branch with the following settings:
- Require pull request reviews before merging
- Require status checks to pass before merging (e.g., the `ci` workflow)
- Restrict force pushes

## CI / CD

- **`.github/workflows/ci.yml`** — Runs on every push/PR to `main`: installs deps, builds, and uploads the `dist/` artifact.
- **`.github/workflows/deploy-pages.yml`** — Deploys the built app to **GitHub Pages** on push to `main`.

After enabling GitHub Pages (Settings → Pages → Source: GitHub Actions), the game will be live at:
`https://<your-username>.github.io/TinyBrave/`

## License

MIT — see [LICENSE](LICENSE).
