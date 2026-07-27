<script lang="ts">
  import type { TargetDict } from "../types";
  import { runCalculation } from "./lib/gameData";
  import ItemPicker from "./components/ItemPicker.svelte";
  import TargetRow from "./components/TargetRow.svelte";
  import ResultsPanel from "./components/ResultsPanel.svelte";

  interface SelectedTarget {
    id: string;
    intervalSec: number;
  }

  let selected = $state<SelectedTarget[]>([
    { id: "fertilizer_t2", intervalSec: 60 },
  ]);

  const targetDict = $derived.by((): TargetDict => {
    const dict: TargetDict = {};
    for (const row of selected) {
      dict[row.id] = { target_interval_sec: row.intervalSec };
    }
    return dict;
  });

  const result = $derived(runCalculation(targetDict));
  const selectedIds = $derived(selected.map((row) => row.id));

  function addItem(id: string) {
    if (selected.some((row) => row.id === id)) return;
    selected = [...selected, { id, intervalSec: 60 }];
  }

  function removeItem(id: string) {
    selected = selected.filter((row) => row.id !== id);
  }

  function setInterval(id: string, intervalSec: number) {
    selected = selected.map((row) =>
      row.id === id ? { ...row, intervalSec } : row,
    );
  }
</script>

<div class="page">
  <header class="hero">
    <p class="eyebrow">The Planet Crafter</p>
    <h1>Production Calculator</h1>
    <p class="lede">
      Pick desired outputs and intervals. Machine counts update live from the
      shared calculator core.
    </p>
  </header>

  <main class="layout">
    <section class="pane">
      <header class="pane-head">
        <h2>Outputs</h2>
        <p>Search to add items. Set how often you want one unit.</p>
      </header>

      <ItemPicker exclude={selectedIds} onadd={addItem} />

      <div class="targets">
        {#if selected.length === 0}
          <p class="empty">No outputs yet. Search above to add one.</p>
        {:else}
          {#each selected as row (row.id)}
            <TargetRow
              id={row.id}
              intervalSec={row.intervalSec}
              oninterval={(value) => setInterval(row.id, value)}
              onremove={() => removeItem(row.id)}
            />
          {/each}
        {/if}
      </div>
    </section>

    <section class="pane pane-results">
      <ResultsPanel {result} />
    </section>
  </main>

  <footer class="site-footer">
    <p class="credit">
      Created by Remy Bozung
      <a
        class="github"
        href="https://github.com/Bozrem/planet-crafter-calc"
        target="_blank"
        rel="noreferrer"
        aria-label="Planet Crafter Calc on GitHub"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
    </p>
    <p class="credit">
      Image and data credit to the
      <a href="https://planet-crafter.fandom.com/" target="_blank" rel="noreferrer"
        >Planet Crafter Wiki</a
      >.
    </p>
  </footer>
</div>

<style>
  .page {
    width: min(1120px, calc(100% - 2rem));
    margin: 0 auto;
    padding: 2rem 0 2.5rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .hero {
    margin-bottom: 1.75rem;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
  }

  h1 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    letter-spacing: -0.03em;
  }

  .lede {
    margin: 0.55rem 0 0;
    max-width: 38rem;
    color: var(--muted);
  }

  .layout {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 1.25rem;
    align-items: start;
  }

  .pane {
    padding: 1.15rem 1.2rem 1.25rem;
    background: color-mix(in srgb, var(--surface) 92%, white);
    border: 1px solid var(--line);
    border-radius: calc(var(--radius) + 4px);
    box-shadow: var(--shadow);
  }

  .pane-head {
    margin-bottom: 1rem;
  }

  .pane-head h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  .pane-head p {
    margin: 0.25rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .targets {
    margin-top: 1rem;
  }

  .empty {
    margin: 1rem 0 0;
    color: var(--muted);
  }

  .site-footer {
    margin-top: auto;
    padding-top: 2.5rem;
    display: grid;
    gap: 0.35rem;
    justify-items: center;
  }

  .site-footer .credit {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
    text-align: center;
  }

  .site-footer a {
    color: var(--accent);
    text-underline-offset: 0.15em;
  }

  .site-footer a:hover {
    color: var(--ink);
  }

  .site-footer .github {
    display: inline-flex;
    vertical-align: -0.2em;
    margin-left: 0.2rem;
    color: var(--muted);
  }

  .site-footer .github:hover {
    color: var(--ink);
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
