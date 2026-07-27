#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { calculateFactory } from "../core/calculator.js";
import type {
  CalculationResult,
  ProducerDict,
  RecipeDict,
  TargetDict,
} from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const DATA_DIR = resolve(ROOT, "data");

function loadJson<T>(filename: string): T {
  const path = resolve(DATA_DIR, filename);
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw) as T;
}

function formatRate(rate: number): string {
  if (rate === 0) return "0";
  if (rate >= 0.01) return rate.toFixed(4).replace(/\.?0+$/, "");
  return rate.toExponential(3);
}

function formatMachines(
  count: number | undefined,
  machineId: string,
): string {
  // Crafted items: demand only; autocrafter count is manual
  if (!machineId) return "—";
  if (count === undefined || count === 0) return "0";
  const exact = count.toFixed(4).replace(/\.?0+$/, "");
  const ceil = Math.ceil(count - 1e-12);
  if (Math.abs(count - ceil) < 1e-9) return String(ceil);
  return `${exact} (⌈${ceil}⌉)`;
}

function printTable(result: CalculationResult): void {
  const items = Object.keys(result.items_per_sec).sort((a, b) => {
    const diff = result.items_per_sec[b]! - result.items_per_sec[a]!;
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  if (items.length === 0) {
    console.log("No demand to calculate (all target_interval_sec are 0).");
    return;
  }

  const rows = items.map((item) => {
    const machineId = result.machine_ids[item] ?? "";
    return {
      item,
      machine: machineId || "craft",
      items_per_sec: formatRate(result.items_per_sec[item] ?? 0),
      machines: formatMachines(result.total_machines[item], machineId),
    };
  });

  const colItem = Math.max(4, ...rows.map((r) => r.item.length));
  const colMachType = Math.max(7, ...rows.map((r) => r.machine.length));
  const colRate = Math.max(13, ...rows.map((r) => r.items_per_sec.length));
  const colCount = Math.max(8, ...rows.map((r) => r.machines.length));

  const header =
    `${"Item".padEnd(colItem)}  ` +
    `${"Machine".padEnd(colMachType)}  ` +
    `${"Items/sec".padStart(colRate)}  ` +
    `${"Count".padStart(colCount)}`;
  const rule = "-".repeat(header.length);

  console.log(header);
  console.log(rule);
  for (const row of rows) {
    console.log(
      `${row.item.padEnd(colItem)}  ` +
        `${row.machine.padEnd(colMachType)}  ` +
        `${row.items_per_sec.padStart(colRate)}  ` +
        `${row.machines.padStart(colCount)}`,
    );
  }
}

function main(): void {
  const recipes = loadJson<RecipeDict>("recipes.json");
  const producers = loadJson<ProducerDict>("producers.json");
  const targets = loadJson<TargetDict>("targets.json");

  const result = calculateFactory(recipes, producers, targets);
  printTable(result);
}

main();
