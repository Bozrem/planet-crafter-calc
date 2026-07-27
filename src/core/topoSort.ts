/**
 * Kahn's algorithm: products before their ingredients.
 *
 * Edge direction: product → ingredient (demand flows from end products inward).
 * Items with in-degree 0 are end products (nothing in the recipe set consumes them).
 */
export function topologicalSort(
  items: Iterable<string>,
  getDependencies: (item: string) => Iterable<string>,
): string[] {
  const nodes = new Set<string>();
  for (const item of items) {
    nodes.add(item);
    for (const dep of getDependencies(item)) {
      nodes.add(dep);
    }
  }

  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node, 0);
    dependents.set(node, []);
  }

  for (const item of nodes) {
    for (const dep of getDependencies(item)) {
      // item depends on dep → edge item → dep for demand order
      // in-degree counts how many items point *to* this node as an ingredient
      inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
      dependents.get(item)!.push(dep);
    }
  }

  const queue: string[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) {
      queue.push(node);
    }
  }

  // Stable-ish: sort zero-degree seeds for deterministic output
  queue.sort();

  const sorted: string[] = [];
  while (queue.length > 0) {
    const item = queue.shift()!;
    sorted.push(item);

    const nextBatch: string[] = [];
    for (const dep of dependents.get(item) ?? []) {
      const next = (inDegree.get(dep) ?? 0) - 1;
      inDegree.set(dep, next);
      if (next === 0) {
        nextBatch.push(dep);
      }
    }
    nextBatch.sort();
    queue.push(...nextBatch);
  }

  if (sorted.length !== nodes.size) {
    const remaining = [...nodes].filter((n) => !sorted.includes(n));
    throw new Error(
      `Cycle detected in recipe graph involving: ${remaining.join(", ")}`,
    );
  }

  return sorted;
}
