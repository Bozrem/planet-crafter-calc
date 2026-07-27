# Planet Crafter Calc

Production calculator for [The Planet Crafter](https://www.planet-crafter.com/). Enter desired item output rates and get how many machines you need to meet them.

## Usage

```bash
npm install
npm start
```

Edit `data/targets.json` (`target_interval_sec`: seconds between one unit; `0` = off), then run again. Recipes and producers live in `data/recipes.json` and `data/producers.json`.

Crafted items only propagate ingredient demand — size autocrafters yourself. Producer targets (ores, farms, etc.) work with or without a recipe.

## Layout

- `src/core/` — pure calculator (no I/O); safe to reuse from a future web UI
- `src/cli/` — reads `data/`, calls the core, prints a table
- `data/` — recipes, producers, and CLI targets
