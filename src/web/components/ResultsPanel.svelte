<script lang="ts">
  import type { CalculationResult } from "../../types";
  import { formatLabel } from "../lib/gameData";
  import ItemIcon from "./ItemIcon.svelte";

  interface Props {
    result: CalculationResult;
  }

  let { result }: Props = $props();

  interface MachineRow {
    item: string;
    machine: string;
    count: number;
  }

  const rows = $derived.by(() => {
    const out: MachineRow[] = [];
    for (const [item, count] of Object.entries(result.total_machines)) {
      const machine = result.machine_ids[item];
      if (!machine || count <= 0) continue;
      out.push({
        item,
        machine,
        count: Math.ceil(count - 1e-12),
      });
    }
    out.sort((a, b) => b.count - a.count || a.item.localeCompare(b.item));
    return out;
  });
</script>

<section class="panel">
  <header>
    <h2>Required machines</h2>
    <p>Counts are rounded up.</p>
  </header>

  {#if rows.length === 0}
    <p class="empty">Add an output on the left to see machine counts.</p>
  {:else}
    <ul>
      {#each rows as row (row.item)}
        <li>
          <ItemIcon id={row.item} />
          <div class="text">
            <strong>{formatLabel(row.item)}</strong>
            <span class="machine">
              <ItemIcon id={row.machine} size="sm" />
              {formatLabel(row.machine)}
            </span>
          </div>
          <span class="count">{row.count}</span>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .panel {
    height: 100%;
  }

  header h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  header p,
  .empty {
    margin: 0.25rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  ul {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
  }

  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--line);
  }

  .text {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  strong {
    font-size: 0.98rem;
  }

  .machine {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--muted);
    font-size: 0.82rem;
  }

  .count {
    font-family: var(--mono);
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--accent);
  }
</style>
