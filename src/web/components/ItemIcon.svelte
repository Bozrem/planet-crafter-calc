<script lang="ts">
  import { formatLabel, iconUrl } from "../lib/gameData";

  interface Props {
    id: string;
    size?: "sm" | "md";
  }

  let { id, size = "md" }: Props = $props();
  let broken = $state(false);

  const dim = $derived(size === "sm" ? 28 : 40);
</script>

{#if broken}
  <span
    class="icon fallback"
    style:width="{dim}px"
    style:height="{dim}px"
    title={formatLabel(id)}
    aria-hidden="true"
  >
    {formatLabel(id).slice(0, 1)}
  </span>
{:else}
  <img
    class="icon"
    src={iconUrl(id)}
    alt=""
    width={dim}
    height={dim}
    onerror={() => (broken = true)}
  />
{/if}

<style>
  .icon {
    display: block;
    flex-shrink: 0;
    border-radius: 6px;
    object-fit: contain;
    background: var(--bg-accent);
  }

  .fallback {
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    border: 1px solid var(--line);
  }
</style>
