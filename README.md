# PersonaOS

Static, fast internal demo for browsing support-adjacent personas, comparing roles, and scanning workflow and pain-point overlap. Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Lucide**, and **d3-sankey** for Sankey diagrams.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build   # output in dist/
npm run preview # serve dist locally
```

## GitHub Pages

1. In the repo **Settings → Pages**, set **Source** to **GitHub Actions**.
2. The workflow in `.github/workflows/deploy-pages.yml` builds with  
   `VITE_BASE=/<repository-name>/` so client-side routes resolve on a project site.
3. Push to `main` to publish (or run the workflow manually).

For a **user/organization site** at the domain root, set `VITE_BASE=/` in the workflow (or in `vite.config.ts`) so `base` is `/`.

## Demo script (5 minutes)

1. **Directory**: Open the app, skim the hero copy, then scroll the persona cards. Call out usage badges (high/medium/light) and department pills.
2. **Search & filters**: In the left rail, search `renewal`, then reset and filter **Customer Success** and **High touch** intensity. Show how the grid and nav list stay in sync.
3. **Detail**: Open **Customer Success Manager**. Walk through Goals → Challenges → **Pain points** → **Daily tasks** (overview + flow Sankey) → **Tools** (logos via Simple Icons CDN, with initials fallback) → Related personas.
4. **Compare**: Turn **Compare** on in the persona list header, select **Support Agent**, **Support Manager / Team Lead**, and **Customer Success Manager**, then **Open comparison**. Point at the amber rings where department, intensity, or workflow type differ. Use **Copy share link** and paste into a new tab.
5. **Overlap & opportunities**: Open **Persona overlap** (curated `painThemes`) then **Opportunities** and tie one card back to overlapping pains.

## Data

Personas and opportunities live in `src/data/personas.ts`. The overlap view uses `painThemes` (short, repeatable labels) so shared themes are legible in a demo without NLP.

## Scripts

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Vite dev server          |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve `dist/`        |
| `npm run lint`  | ESLint                 |
