# Planet Crafter Calc

Production calculator for [The Planet Crafter](https://www.planet-crafter.com/). Enter desired item output rates and get how many machines you need to meet them.

## Usage

### Web UI (V2)

```bash
npm install
npm run dev
```

Open the local Vite URL. Add outputs via the search box, set intervals, and read rounded-up machine counts on the right.

Drop item/machine icons into `public/icons/` as `{id}.png` (e.g. `fertilizer_t2.png`). Missing icons use a letter fallback.

### CLI (V1)

```bash
npm start
```

Edit `data/targets.json` (`target_interval_sec`: seconds between one unit; `0` = off). Recipes and producers live in `data/recipes.json` and `data/producers.json`.

Crafted items only propagate ingredient demand — size autocrafters yourself. Producer targets (ores, farms, etc.) work with or without a recipe.

## Layout

- `src/core/` — pure calculator (no I/O); shared by CLI and web
- `src/cli/` — reads `data/`, calls the core, prints a table
- `src/web/` — Svelte + Vite UI
- `data/` — recipes, producers, and CLI targets
