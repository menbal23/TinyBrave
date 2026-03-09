# TinyBrave 🗡️

> 레트로 픽셀 감성의 2D 턴제 RPG 스타터 — Phaser 3 + TypeScript + Vite

[![Build and Deploy](https://github.com/menbal23/TinyBrave/actions/workflows/deploy.yml/badge.svg)](https://github.com/menbal23/TinyBrave/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎮 게임 플레이

**[▶ Live Demo (GitHub Pages)](https://menbal23.github.io/TinyBrave/)**

### 조작법
| 키 | 동작 |
|---|---|
| `W` / `↑` | 위로 이동 |
| `S` / `↓` | 아래로 이동 |
| `A` / `←` | 왼쪽 이동 |
| `D` / `→` | 오른쪽 이동 |

---

## 🏗️ 프로젝트 구조

```
TinyBrave/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: 빌드 + GitHub Pages 배포
├── public/
│   └── assets/
│       ├── tilemaps/
│       │   └── example.json    # Tiled 예제 맵 (10×10)
│       ├── tilesets/
│       │   └── tileset.png     # 픽셀 아트 타일셋 placeholder (48×16, 3 tiles)
│       └── sprites/
│           └── player.png      # 플레이어 스프라이트 placeholder (64×16, 4 frames)
├── src/
│   ├── main.ts                 # 엔트리 포인트
│   ├── game.ts                 # Phaser 게임 설정
│   ├── types/
│   │   └── index.ts            # 공통 타입 정의
│   ├── scenes/
│   │   ├── MenuScene.ts        # 메인 메뉴 씬
│   │   ├── MapScene.ts         # 맵 탐색 씬 (Tiled 타일맵 + 플레이어 이동)
│   │   └── BattleScene.ts      # 턴제 전투 씬
│   └── objects/
│       └── Player.ts           # 플레이어 (4방향 이동, 카메라 추적)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── package.json
└── LICENSE
```

---

## ✨ 기능

- **씬 관리**: Menu → Map → Battle 씬 전환
- **타일맵**: Tiled JSON 포맷 타일맵 로드 (orthogonal, 16×16 타일)
- **플레이어 이동**: WASD / 화살표키 4방향 이동, 대각선 이동 지원
- **카메라**: 플레이어 추적, 맵 경계 클램핑
- **턴제 전투**: 공격 / 스킬 / 도망 선택지, 승리/패배/도망 처리
- **랜덤 인카운터**: 이동 중 일정 확률로 전투 돌입
- **픽셀 아트 렌더링**: `pixelArt: true`, `image-rendering: pixelated`

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 9+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 린트 / 포맷

```bash
npm run lint       # ESLint 검사
npm run format     # Prettier 포맷
```

---

## 🗺️ Tiled 맵 편집

1. [Tiled Map Editor](https://www.mapeditor.org/) 설치
2. `public/assets/tilemaps/example.json` 파일 열기
3. 타일셋: `public/assets/tilesets/tileset.png` (16×16 타일, 3종)
   - **Tile 1**: 풀밭 (이동 가능)
   - **Tile 2**: 물 (이동 불가)
   - **Tile 3**: 벽 (이동 불가)
4. 맵 수정 후 저장 (JSON 형식 유지)

---

## 📦 기술 스택

| 기술 | 버전 | 용도 |
|---|---|---|
| [Phaser 3](https://phaser.io/) | ^3.80 | 2D 게임 엔진 |
| [TypeScript](https://www.typescriptlang.org/) | ^5.4 | 타입 안전성 |
| [Vite](https://vitejs.dev/) | ^5.2 | 번들러 / 개발 서버 |
| [ESLint](https://eslint.org/) | ^8.57 | 코드 품질 |
| [Prettier](https://prettier.io/) | ^3.2 | 코드 포맷 |

---

## 🚢 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로:
1. 의존성 설치 (`npm ci`)
2. 린트 (`npm run lint`)
3. 빌드 (`npm run build`)
4. `dist/` 폴더를 GitHub Pages에 배포

GitHub Pages 활성화: **Settings → Pages → Source: GitHub Actions**

---

## 📝 라이선스

[MIT](LICENSE) © 2024 TinyBrave Contributors
