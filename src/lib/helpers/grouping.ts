import type { Items } from "$lib/types";

export const groupItemsByDate = (items: Items[]) => {
  const groups: Record<string, Items[]> = {};
  for (const item of items) {
    const date = item.uploadedAt.toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  }
  return Object.entries(groups)
    .map(([date, items]) => ({
      date: new Date(date),
      items: items.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ),
    }))
    .reverse();
};
