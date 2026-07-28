# EYFI Campus Ambassador — Reward Ladder

**Built by:** Amol
**Assignment:** Interactive reward ladder for the Campus Ambassador program

---

## 1. What I built

A winding "quest path" instead of a flat progress bar — an SVG path with milestone coins placed along it using `getPointAtLength()`. Dragging the slider moves a glowing marker along the path, and each coin flips from locked-grey to the site's gold coin gradient the moment its threshold is crossed, with the matching reward card animating in below.

Design tokens (background color, card borders, the gold gradient, fonts) were pulled directly from the live ambassador page's computed CSS, so this slots in as an extension of the existing site rather than a visual mismatch.

## 2. System-level thinking

A few things I'd flag before this goes anywhere near production, since the assignment version is intentionally a self-contained demo:

**Data source.** Right now the slider *is* the registration count — that's fine for a demo, but in production the count needs to come from the backend (however registrations are tracked — referral codes, a Google Form + Sheet, a proper DB). The component should accept `registrations` as a prop and be purely presentational; a parent component owns the fetch/poll/websocket logic. I've structured `RewardLadder.jsx` so that swap is a one-line change (replace `useState(0)` with a prop).

**Milestone config shouldn't be hardcoded.** The `MILESTONES` array is inline right now. If thresholds or rewards change (they will — this is a Wave 01 product), that shouldn't require a redeploy. Worth moving to a config table (even a simple JSON served from an endpoint, or a CMS field) so ops/marketing can tweak numbers without engineering in the loop.

**Anti-gaming.** Once real registration numbers drive real rewards (swag, internships, Founding Team consideration), the count needs server-side validation — dedupe by device/IP/referral fraud checks — before it's trusted client-side. Not this component's job, but worth flagging early since reward ladders are a common target for gaming once money/prestige is on the line.

**Notifications.** The satisfying moment here is crossing a threshold. Right now that only happens if the ambassador is staring at the page when it happens. A real version should fire a notification (email/WhatsApp, given you're already using WhatsApp for support) the moment a milestone unlocks, so the dopamine hit isn't wasted on nobody watching.

**Analytics.** I'd instrument milestone-crossing as an event (whatever you're using — Mixpanel/PostHog/GA) to see where ambassadors plateau. If most people stall at 25→50, that's a signal the mid-tier reward isn't motivating enough, not just a random drop-off.

## 3. Smaller suggestions

- Accessibility: add an `aria-live` region announcing "You've unlocked Campus Ambassador" when a threshold crosses, and make sure the slider is fully keyboard-operable (native `<input type="range">` already gets you most of this for free).
- Performance: `getPointAtLength` is called on every render for every node — fine at 6 nodes, but worth memoizing node positions once (they don't depend on `regs`) if this pattern gets reused for something with more steps.
- Testing: the milestone boundary logic (`idx`/`overallFrac` calculation) is the one piece of real logic here and is easy to unit test in isolation — worth a quick test file before this ships, since off-by-one errors in a rewards ladder are the kind of bug users notice immediately.

## 4. Tools used

- **React (Vite)** — functional component, hooks only, no extra state libraries
- **lucide-react** — icons for each milestone (Flag, KeyRound, Gem, Briefcase, Crown, Trophy)
- **Plain CSS** with custom properties matching the site's existing tokens (`oklch()` colors, Bricolage Grotesque / Open Sans)
- **Claude** — used to extract design tokens from DevTools screenshots, scaffold the component, and verify the build against a real Vite project before submitting

## 5. Running it

```
npm install
npm run dev
```

Component lives at `src/components/RewardLadder/RewardLadder.jsx`, rendered from `src/App.jsx`.
