<script lang="ts">
  import { formatLabel } from "../lib/gameData";
  import ItemIcon from "./ItemIcon.svelte";

  interface Props {
    id: string;
    intervalSec: number;
    oninterval: (value: number) => void;
    onremove: () => void;
  }

  let { id, intervalSec, oninterval, onremove }: Props = $props();

  const MIN = 5;
  const MAX = 600;

  const clamped = $derived(Math.min(MAX, Math.max(MIN, intervalSec)));
  const perMin = $derived(60 / intervalSec);

  function setInterval(raw: number) {
    if (!Number.isFinite(raw) || raw <= 0) return;
    oninterval(raw);
  }
</script>

<article class="row">
  <ItemIcon {id} />

  <div class="meta">
    <div class="title-line">
      <h3>{formatLabel(id)}</h3>
      <button
        type="button"
        class="remove"
        aria-label="Remove {formatLabel(id)}"
        onclick={onremove}
      >
        −
      </button>
    </div>

    <div class="controls">
      <label>
        <span>Every</span>
        <input
          type="number"
          min={1}
          step={1}
          value={intervalSec}
          oninput={(e) => setInterval(Number(e.currentTarget.value))}
        />
        <span>sec</span>
      </label>

      <input
        class="slider"
        type="range"
        min={MIN}
        max={MAX}
        step={5}
        value={clamped}
        oninput={(e) => setInterval(Number(e.currentTarget.value))}
      />

      <p class="rate">{perMin.toFixed(2)} / min</p>
    </div>
  </div>
</article>

<style>
  .row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.85rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--line);
  }

  .row:last-child {
    border-bottom: 0;
  }

  .meta {
    min-width: 0;
  }

  .title-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .remove {
    width: 1.85rem;
    height: 1.85rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface);
    color: var(--danger);
    font-size: 1.25rem;
    line-height: 1;
  }

  .remove:hover {
    background: var(--accent-soft);
  }

  .controls {
    display: grid;
    gap: 0.45rem;
    margin-top: 0.55rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--muted);
    font-size: 0.9rem;
  }

  input[type="number"] {
    width: 5rem;
    padding: 0.3rem 0.45rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--surface);
    font-family: var(--mono);
    font-size: 0.85rem;
  }

  .slider {
    width: 100%;
    accent-color: var(--accent);
  }

  .rate {
    margin: 0;
    font-family: var(--mono);
    font-size: 0.8rem;
    color: var(--muted);
  }
</style>
