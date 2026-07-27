<script lang="ts">
  import { catalogItems, formatLabel } from "../lib/gameData";
  import ItemIcon from "./ItemIcon.svelte";

  interface Props {
    exclude: string[];
    onadd: (id: string) => void;
  }

  let { exclude, onadd }: Props = $props();

  let query = $state("");
  let open = $state(false);
  let rootEl: HTMLDivElement | undefined = $state();

  const allItems = catalogItems();

  const options = $derived(
    allItems
      .filter((id) => !exclude.includes(id))
      .filter((id) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return id.includes(q) || formatLabel(id).toLowerCase().includes(q);
      })
      .slice(0, 40),
  );

  function select(id: string) {
    onadd(id);
    query = "";
    open = false;
  }

  function onDocumentPointerDown(event: PointerEvent) {
    if (!rootEl) return;
    if (!rootEl.contains(event.target as Node)) {
      open = false;
    }
  }
</script>

<svelte:document onpointerdown={onDocumentPointerDown} />

<div class="picker" bind:this={rootEl}>
  <label class="label" for="item-search">Add output item</label>
  <input
    id="item-search"
    type="search"
    placeholder="Search items…"
    autocomplete="off"
    bind:value={query}
    onfocus={() => (open = true)}
    onkeydown={(e) => {
      if (e.key === "Escape") open = false;
      if (e.key === "Enter" && options[0]) {
        e.preventDefault();
        select(options[0]);
      }
    }}
  />

  {#if open}
    <ul class="menu" role="listbox">
      {#if options.length === 0}
        <li class="empty">No matching items</li>
      {:else}
        {#each options as id (id)}
          <li>
            <button
              type="button"
              role="option"
              aria-selected="false"
              onclick={() => select(id)}
            >
              <ItemIcon {id} size="sm" />
              <span>{formatLabel(id)}</span>
            </button>
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>

<style>
  .picker {
    position: relative;
  }

  .label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
  }

  input {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--shadow);
  }

  input:focus {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  .menu {
    position: absolute;
    z-index: 20;
    top: calc(100% + 0.35rem);
    left: 0;
    right: 0;
    margin: 0;
    padding: 0.35rem;
    list-style: none;
    max-height: 16rem;
    overflow: auto;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: 0 12px 28px rgb(42 36 32 / 10%);
  }

  .menu button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.45rem 0.55rem;
    border: 0;
    border-radius: 8px;
    background: transparent;
    text-align: left;
  }

  .menu button:hover,
  .menu button:focus-visible {
    background: var(--accent-soft);
    outline: none;
  }

  .empty {
    padding: 0.75rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
</style>
