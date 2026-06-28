# Storybook setup

Stories are written for the main reusable UI components. To install and run Storybook:

```bash
cd apps/web
pnpm dlx storybook@latest init --type react --no-dev
pnpm storybook
```

The init wizard will:
- Install `@storybook/react-vite`, `@storybook/addon-essentials`, etc.
- Create `.storybook/main.ts` and `.storybook/preview.ts`
- Add `storybook` and `build-storybook` to package.json scripts

Update `.storybook/main.ts` after init to point at our story location:

```ts
stories: ['../src/**/*.stories.@(ts|tsx)']
```

And in `.storybook/preview.ts` import Tailwind:

```ts
import '../src/index.css'
```

## Stories included

- `MascotOverlay.stories.tsx` — all 6 mascots (Don Fomento, Maicita, La Vaquita, Don Café, La Canche, La Tormenta) with sample dialogues
- `AchievementToast.stories.tsx` — 4 sample achievement unlock toasts
- `QuizModal.stories.tsx` — 3 educational quiz examples

Add more stories for: GameHUD (multi/solo/spectator), VictoryScreen, RulesModal, TutorialModal, EduTipOverlay, TradeModal, ChatPanel.
