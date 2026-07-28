# EYFI Reward Ladder

Interactive reward ladder for the EYFI Campus Ambassador program — a winding
"quest path" that unlocks milestones (Scout → Founding Team) as registration
count climbs, built to match the visual language of the live ambassador page.

## Setup

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  components/
    RewardLadder/
      RewardLadder.jsx   # component logic
      RewardLadder.css   # styles, scoped with rl- prefixed classes
  App.jsx                # renders <RewardLadder />
  main.jsx                # React entry point
  index.css               # global reset
```

## Usage

```jsx
import RewardLadder from './components/RewardLadder/RewardLadder';

function App() {
  return <RewardLadder />;
}
```

The component is currently self-contained (internal `useState` drives the
slider for demo purposes). To wire it to real data, the six-line change is
swapping `useState(0)` for a `registrations` prop passed down from wherever
the real count lives (API/DB/websocket) — see `SUBMISSION.md` for more on
that and other production considerations.

## Requirements

- Node 18+
- React 19
- `lucide-react` for icons (already in `package.json`)

## Notes

- Colors use `oklch()` — supported in all current major browsers (Chrome,
  Firefox, Safari, Edge). No fallback needed for evergreen browser targets.
- See `SUBMISSION.md` for design rationale and product/engineering suggestions.
