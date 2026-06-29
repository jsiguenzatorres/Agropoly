# 📦 Guía de instalación — AGROPOLY APEX

Juego de mesa digital del **Banco de Fomento Agropecuario de El Salvador**.
Monorepo Turborepo + pnpm con cliente web (React + R3F) y server (Hono + Colyseus + SQLite).

---

## Requisitos previos

| Herramienta | Versión mínima | Verificar |
|-------------|---------------|-----------|
| **Node.js** | 20 o superior | `node --version` |
| **pnpm** | 9 o superior | `pnpm --version` |
| **Git** | cualquiera reciente | `git --version` |

Si no tenés pnpm instalado:

```bash
npm install -g pnpm@9
```

---

## Instalación rápida

```bash
# 1. Clonar el repo
git clone https://github.com/jsiguenzatorres/Agropoly.git
cd Agropoly

# 2. Instalar dependencias del monorepo (tarda ~2-3 min la primera vez)
pnpm install

# 3. Levantar todo en modo desarrollo
pnpm dev
```

Eso es todo. El comando `pnpm dev` levanta en paralelo:

- 🌐 **Cliente web** → `http://localhost:5173` (Vite + React 18 + R3F)
- 🛰️ **Server API + Colyseus** → `http://localhost:2567` (Hono + SQLite + WebSocket)

Abrí `http://localhost:5173` y deberías ver el splash con el logo BFA y "AGROPOLY" en dorado.

---

## Configuración opcional (variables de entorno)

### `apps/server/.env`

```bash
# Admin password para /admin/historias — OBLIGATORIO cambiar antes de producción
ADMIN_PASSWORD=tu-password-super-seguro-aqui

# Puerto del server (default: 2567)
PORT=2567

# CORS — URL del cliente
WEB_URL=http://localhost:5173

# Path de la SQLite DB
DB_PATH=./data/agropoly.db

# Opcional — Sentry para tracking de errores en producción
SENTRY_DSN=
```

### `apps/web/.env`

```bash
# URL del backend
VITE_API_URL=http://localhost:2567

# Opcional — Sentry frontend
VITE_SENTRY_DSN=
```

> ⚠️ **Seguridad**: el `ADMIN_PASSWORD` default es `agropoly-bfa-2026` (solo dev).
> En producción, cambialo a algo único conocido únicamente por el equipo BFA.

---

## Comandos disponibles

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Modo desarrollo (web + server simultáneo, hot reload) |
| `pnpm build` | Build de producción de todos los apps |
| `pnpm typecheck` | Verifica tipos TypeScript en todo el monorepo |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm lint` | ESLint en todo el monorepo |
| `pnpm format` | Prettier sobre todos los archivos |
| `pnpm clean` | Limpia caches y `node_modules` |

### Filtros por workspace

Si solo querés trabajar en un app específico:

```bash
pnpm --filter @agropoly/web dev          # solo el cliente
pnpm --filter @agropoly/server dev       # solo el server
pnpm --filter @agropoly/web typecheck    # typecheck solo del web
pnpm --filter @agropoly/web build        # build solo del cliente
```

---

## Estructura del monorepo

```
Agropoly/
├── apps/
│   ├── web/                    ← Cliente React + Vite + R3F
│   │   ├── src/
│   │   │   ├── routes/         ← splash, lobby, game, dashboard, historias, admin
│   │   │   ├── components/
│   │   │   │   ├── ui/         ← MascotOverlay, BillFomento, StoryIntro, etc.
│   │   │   │   └── three/      ← GameScene, DiceRoll3D
│   │   │   ├── lib/            ← speech, analytics, sfx, historias-api
│   │   │   └── store/          ← gameStore, multiplayerStore, GameModeContext
│   │   └── public/             ← logo-bfa.png, widget-bfa.png
│   └── server/                 ← Hono + Colyseus + SQLite
│       └── src/
│           ├── api/            ← analytics, historias, leaderboard, sessions
│           ├── rooms/          ← GameRoom (Colyseus)
│           └── db.ts           ← SQLite + seeds
├── packages/
│   ├── game-engine/            ← lógica del juego compartida
│   └── shared-types/           ← tipos TS compartidos
└── package.json                ← scripts raíz (turbo run)
```

---

## Despliegue en producción

### Cliente (`apps/web`) → hosting estático

Compatible con cualquier proveedor de static hosting:

- **Vercel** / **Netlify** / **Cloudflare Pages** / **GitHub Pages**

```bash
pnpm --filter @agropoly/web build
# Output: apps/web/dist
```

Configurar la variable `VITE_API_URL` apuntando al server desplegado.

### Server (`apps/server`) → Node.js runtime

Necesita un host con Node.js + soporte para **WebSockets** (Colyseus):

- **Railway** / **Fly.io** / **Render** / **VPS propio**

```bash
pnpm --filter @agropoly/server build
pnpm --filter @agropoly/server start
```

**Importante**:
- El server expone puerto HTTP + WebSocket — verificar que el hosting lo permita.
- **Persistir el directorio `./data/`** entre deploys (contiene la SQLite con partidas, leaderboard, analytics y contenido de Historias del Campo).
- Setear todas las variables de `.env` en el panel del hosting.

---

## Acceso al admin de Historias del Campo

URL: `/admin/historias`

- **Default dev password**: `agropoly-bfa-2026`
- **Producción**: setear `ADMIN_PASSWORD` en el `.env` del server con un valor único conocido solo por el equipo BFA.
- Sesión de 24h en cookie `httpOnly`.
- Permite editar los textos de las 6 mascotas (origen, rubro, desafíos, producto BFA, etc.) sin redeploy.

---

## Verificar instalación correcta

Después de `pnpm dev`:

1. Abrí `http://localhost:5173`
2. Esperá el splash con el logo BFA institucional
3. Andá a **Nueva Partida** → ingresá nombre → **Iniciar Partida**
4. Deberías ver el **Story Intro** con cada jugador y su crédito ƒ1,500 en billetes
5. Cliqueá **Lanzar Dados** y verificá que los dados 3D Rapier caen antes de mover la ficha

---

## Problemas comunes

| Problema | Solución |
|----------|----------|
| Puerto 5173 o 2567 ocupado | Cerrá otros procesos o cambia `PORT` en `.env` |
| `Cannot find module` | Corré `pnpm install` de nuevo |
| Tipos TS del `game-engine` con warnings | Pre-existentes, no bloquean el desarrollo |
| Voz del narrador suena en inglés | Instalá una voz en español latino en tu sistema (Windows: Configuración → Hora e idioma → Agregar idioma → Español (México) → activar Voz). Click en el chip 🗣️ del HUD para ver guía completa por SO |
| Audio bloqueado al inicio | Chrome bloquea audio hasta que el usuario interactúe con la página — el audio se desbloquea automáticamente al primer click |

---

## Stack técnico

**Frontend**
- React 18.3 + TypeScript strict + Vite
- @react-three/fiber + @react-three/drei + @react-three/rapier
- Tailwind CSS + Framer Motion + GSAP
- zustand 5 + immer + @tanstack/react-query
- Recharts (dashboard) + Tone.js + Howler.js + Web Speech API
- PWA (vite-plugin-pwa)

**Backend**
- Hono + @hono/node-server
- Colyseus 0.15 (multijugador autoritativo via WebSocket)
- better-sqlite3 + Drizzle ORM scaffold
- Zod (validación)
- Sentry (opcional)

**Tooling**
- Turborepo + pnpm workspaces
- Vitest (unit) + Playwright (e2e)
- ESLint + Prettier
- TypeScript 5.5 strict

---

## Recursos del proyecto

- **Repo**: https://github.com/jsiguenzatorres/Agropoly
- **Sitio BFA**: https://www.bfa.gob.sv
- **Contexto del proyecto**: `AGROPOLY_CONTEXT.md`
- **Decisiones arquitectónicas**: `AGROPOLY_ADRs.md`
