/** Recipe for crafting an item (keyed by output item id). */
export interface Recipe {
  /** Ingredient item id → quantity consumed per craft. */
  inputs: Record<string, number>;
}

export type RecipeDict = Record<string, Recipe>;

/**
 * Machine that produces raw (or harvested) items.
 * Keyed by machine id in producers.json (e.g. "ore_extractor_t3").
 */
export interface Producer {
  /** Seconds between output cycles. */
  cycle_time_sec: number;
  /** Item ids this machine can produce (one item per placement / configuration). */
  produces: string[];
}

export type ProducerDict = Record<string, Producer>;

/** Desired output cadence for an item. */
export interface Target {
  /**
   * Desired seconds between producing one unit.
   * `0` means no demand. Rate is `1 / target_interval_sec` items/sec when > 0.
   */
  target_interval_sec: number;
}

export type TargetDict = Record<string, Target>;

export interface CalculationResult {
  /** Machines required to produce each item (keyed by item id). Crafted items are omitted. */
  total_machines: Record<string, number>;
  /** Required throughput for each item (items per second). */
  items_per_sec: Record<string, number>;
  /** Machine id used for each item. Empty string for craft-only demand (no machine sizing). */
  machine_ids: Record<string, string>;
}
