/**
 * MongoDB returns _id. Admin components use .id in many places.
 * This normalizer adds an `id` alias equal to `_id` on every object.
 * Call it on any API response before storing in state.
 */
export function normalizeId<T extends { _id?: string; id?: string }>(item: T): T & { id: string } {
  const id = item._id || item.id || '';
  return { ...item, id, _id: id };
}

export function normalizeList<T extends { _id?: string; id?: string }>(items: T[]): (T & { id: string })[] {
  return items.map(normalizeId);
}
