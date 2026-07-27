import type {
  CalculationResult,
  Producer,
  ProducerDict,
  RecipeDict,
  TargetDict,
} from "../types.js";
import { topologicalSort } from "./topoSort.js";

interface ProducerRef {
  machine_id: string;
  cycle_time_sec: number;
}

/** Invert machine→produces[] into item → producer for lookups. */
export function indexProducersByItem(
  producers: ProducerDict,
): Map<string, ProducerRef> {
  const byItem = new Map<string, ProducerRef>();

  for (const [machine_id, producer] of Object.entries(producers)) {
    validateProducer(machine_id, producer);
    for (const item of producer.produces) {
      const existing = byItem.get(item);
      if (existing) {
        throw new Error(
          `Item "${item}" is listed under both "${existing.machine_id}" and "${machine_id}"`,
        );
      }
      byItem.set(item, {
        machine_id,
        cycle_time_sec: producer.cycle_time_sec,
      });
    }
  }

  return byItem;
}

function validateProducer(machine_id: string, producer: Producer): void {
  if (producer.cycle_time_sec <= 0) {
    throw new Error(`Producer "${machine_id}" has invalid cycle_time_sec`);
  }
  if (!Array.isArray(producer.produces) || producer.produces.length === 0) {
    throw new Error(`Producer "${machine_id}" must list at least one item in produces`);
  }
}

/** Convert target intervals to items/sec. Interval 0 → no demand. */
export function targetsToDemand(targets: TargetDict): Record<string, number> {
  const demand: Record<string, number> = {};

  for (const [item, target] of Object.entries(targets)) {
    const interval = target.target_interval_sec;
    if (interval < 0) {
      throw new Error(`Target interval for "${item}" must be non-negative`);
    }
    if (interval === 0) {
      continue;
    }
    demand[item] = (demand[item] ?? 0) + 1 / interval;
  }

  return demand;
}

/**
 * Propagate target output rates through the recipe graph and compute
 * required producer machine counts. Crafted items contribute demand only
 * (autocrafter count is left to the user).
 */
export function calculateFactory(
  recipes: RecipeDict,
  producers: ProducerDict,
  targets: TargetDict,
): CalculationResult {
  const demand = targetsToDemand(targets);
  const producersByItem = indexProducersByItem(producers);

  const relevantItems = new Set<string>(Object.keys(demand));

  // Walk recipe inputs so topo sort covers the full dependency closure
  const stack = [...relevantItems];
  while (stack.length > 0) {
    const item = stack.pop()!;
    const recipe = recipes[item];
    if (!recipe) continue;
    for (const ingredient of Object.keys(recipe.inputs)) {
      if (!relevantItems.has(ingredient)) {
        relevantItems.add(ingredient);
        stack.push(ingredient);
      }
    }
  }

  const order = topologicalSort(relevantItems, (item) => {
    const recipe = recipes[item];
    return recipe ? Object.keys(recipe.inputs) : [];
  });

  const items_per_sec: Record<string, number> = {};
  const total_machines: Record<string, number> = {};
  const machine_ids: Record<string, string> = {};

  for (const item of order) {
    const rate = demand[item] ?? 0;
    items_per_sec[item] = rate;

    if (rate <= 0) {
      continue;
    }

    const recipe = recipes[item];
    if (recipe) {
      // Crafted: propagate ingredient demand; user sizes autocrafters separately
      machine_ids[item] = "";

      for (const [ingredient, qty] of Object.entries(recipe.inputs)) {
        if (qty < 0) {
          throw new Error(
            `Recipe for "${item}" has negative input quantity for "${ingredient}"`,
          );
        }
        demand[ingredient] = (demand[ingredient] ?? 0) + rate * qty;
      }
      continue;
    }

    const producer = producersByItem.get(item);
    if (producer) {
      // 1 output per cycle; machines = rate * cycle_time
      total_machines[item] = rate * producer.cycle_time_sec;
      machine_ids[item] = producer.machine_id;
      continue;
    }

    // No recipe or producer: demand is recorded but machines cannot be sized
    total_machines[item] = 0;
    machine_ids[item] = "";
  }

  return { total_machines, items_per_sec, machine_ids };
}
