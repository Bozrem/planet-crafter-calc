import recipes from "../../../data/recipes.json";
import producers from "../../../data/producers.json";
import type { ProducerDict, RecipeDict, TargetDict } from "../../types";
import { calculateFactory } from "../../core/calculator";

export const recipeData = recipes as RecipeDict;
export const producerData = producers as ProducerDict;

/** Humanize snake_case ids for display. */
export function formatLabel(id: string): string {
  return id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** All selectable item ids: recipes + producer outputs. */
export function catalogItems(): string[] {
  const ids = new Set<string>(Object.keys(recipeData));
  for (const producer of Object.values(producerData)) {
    for (const item of producer.produces) {
      ids.add(item);
    }
  }
  return [...ids].sort((a, b) => formatLabel(a).localeCompare(formatLabel(b)));
}

export function runCalculation(targets: TargetDict) {
  return calculateFactory(recipeData, producerData, targets);
}

export function iconUrl(id: string): string {
  return `${import.meta.env.BASE_URL}icons/${id}.png`;
}
