# SparkNet Copilot Instructions

## Project Overview
SparkNet is a React 19 + TypeScript web application predicting wildfire severity in Southern California. It's a marketing/informational site built with Vite, emphasizing accessibility to critical fire prediction data through an AI-powered interface.

**Key stack:** React 19, React Router 7 (hash routing), Tailwind CSS, Lucide React icons, Recharts for data visualization.

## Architecture

### Routing & Layout
- **HashRouter** (`App.tsx`): Uses hash-based routing for AI Studio deployment compatibility
- **Layout pattern:** `Navbar` (fixed) → route content → `Footer` (sticky)
- **Pages structure:** Three main routes (`/`, `/about`, `/contact`) defined in `App.tsx` Routes
- **ScrollToTop:** Auto-scroll on navigation (pathname change)

### Component Organization
- **`components/`**: Reusable UI components
  - `GlassCard`: Glassmorphism wrapper (`bg-white/5 backdrop-blur-lg border border-white/10`). Used extensively in cards sections—**always use for consistent styling**
  - `Navbar`: Fixed navigation with mobile hamburger menu, scroll-aware styling
  - `Footer`: Static footer (check `Footer.tsx` for structure)
- **`pages/`**: Route-level components
  - `Home.tsx`: Hero, stats section, value proposition (uses GlassCard for stat cards)
  - `About.tsx`: Technology explanation with bar charts (Recharts integration for feature importance data)
  - `Contact.tsx`: Form submission (check implementation for validation)

### Styling Conventions
- **Tailwind CSS** with custom color scheme: `brand-orange` (primary), `brand-blue` (accent)
- **Design system:** Glassmorphism (`backdrop-blur-lg`, `bg-white/5`), gradient text, animated elements
- **Animations:** `animate-pulse`, `animate-fade-in-up` (verify in Tailwind config for custom animations)
- **Responsive:** Mobile-first with `md:` and `lg:` breakpoints

## Development Workflow

### Local Setup
1. `npm install` — Install dependencies
2. Set `GEMINI_API_KEY` in `.env.local` (required for API features)
3. `npm run dev` — Start dev server (port 3000 by default, see `vite.config.ts`)

### Build & Preview
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Serve production build locally

### Environment Variables
- `GEMINI_API_KEY`: Exposed via `process.env.GEMINI_API_KEY` in `vite.config.ts`
- **Important:** Variables are injected at build time; changes require rebuild

## Key Patterns & Conventions

### React Patterns
- **Functional components** with `React.FC` type annotation throughout
- **Hooks:** `useState` for state (mobile menu in Navbar), `useEffect` for side effects (scroll listeners, cleanup)
- **React Router:** `useLocation()` for active link detection, `Link` for navigation (never `<a>`)

### Icon Usage
- **Lucide React:** All icons from this library (Flame, Menu, X, AlertTriangle, etc.)
- Import format: `import { IconName } from 'lucide-react'`

### Data Visualization
- **Recharts** used in `About.tsx` for bar charts
- Pattern: `ResponsiveContainer` wrapping chart components with `CustomTooltip` for data formatting
- Example: Feature importance chart showing model factors (Wind Speed, Max Temp, Humidity, etc.)

### Mobile-Responsive Design
- **Navbar:** Hamburger menu on `md:` breakpoint, automatic collapse on link click
- **Grid layouts:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- **Flexbox stacking:** Use `flex-col sm:flex-row` for vertical-to-horizontal transitions

## Important Implementation Details

### Path Resolution
- **Alias:** `@/` maps to workspace root in `tsconfig.json`
- Use `import Component from '@/components/GlassCard'` rather than relative paths

### TypeScript Configuration
- **JSX mode:** `react-jsx` (automatic JSX transformation)
- **Module resolution:** `bundler` mode
- **Type checking:** `skipLibCheck: true` for performance

### Known External Dependencies
- `react-router-dom`: Hash-based routing (critical for deployment context)
- `lucide-react`: Icon system (consistent iconography)
- `recharts`: Charting library for visualizations

## Testing & Validation
- No test files currently present; add tests following Jest + React Testing Library pattern if needed
- Manual testing via `npm run dev` and browser navigation

## Common Tasks

### Adding a New Page
1. Create `.tsx` file in `pages/` with `React.FC` component
2. Add `Route` in `App.tsx` Routes component
3. Update `Navbar.tsx` navLinks array if navigation needed

### Adding a New Reusable Component
1. Create `.tsx` file in `components/`
2. Use TypeScript interfaces for props (see `GlassCard.tsx` pattern)
3. Export as default at bottom

### Styling New Elements
- Prefer existing Tailwind classes; extend via `tailwind.config.ts` if custom colors needed
- Use GlassCard for contained sections (maintains brand consistency)
- Test responsive behavior at `sm`, `md`, `lg` breakpoints

## Deployment Notes
- Built for **AI Studio** deployment (hash routing, env var injection)
- Vite configured for SPA with alias resolution
- `.env.local` required in deployment environment for GEMINI_API_KEY
