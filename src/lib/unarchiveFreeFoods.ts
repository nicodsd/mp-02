import { URI } from "@/src/lib/const";

const unarchivedRequestedIds = new Set<string>();

export function isFreePlan(plan?: string | null): boolean {
  return !plan || plan === "free";
}

export function normalizeFoodsForPlan<T extends Record<string, any>>(
  foods: T[] | undefined | null,
  plan?: string | null
): T[] {
  if (!Array.isArray(foods)) return [];
  if (!isFreePlan(plan)) return foods;
  return foods.map((food) =>
    food?.is_archived ? { ...food, is_archived: false } : food
  );
}

export async function unarchiveFoodsForFreeUser(
  foods: any[] | undefined | null,
  plan?: string | null
): Promise<boolean> {
  if (!isFreePlan(plan) || !Array.isArray(foods)) return false;

  const archivedFoods = foods.filter(
    (food) =>
      food?._id &&
      food?.is_archived === true &&
      !unarchivedRequestedIds.has(String(food._id))
  );

  if (archivedFoods.length === 0) return false;

  archivedFoods.forEach((food) => unarchivedRequestedIds.add(String(food._id)));

  const results = await Promise.allSettled(
    archivedFoods.map((food) => {
      const dataToSend = new FormData();
      if (food.name !== undefined) dataToSend.append("name", String(food.name));
      if (food.description !== undefined) {
        dataToSend.append("description", String(food.description));
      }
      if (food.price !== undefined) dataToSend.append("price", String(food.price));
      dataToSend.append("is_archived", "false");

      return fetch(`${URI}/foods/update/${food._id}`, {
        method: "PUT",
        body: dataToSend,
        credentials: "include",
      });
    })
  );

  return results.some((r) => r.status === "fulfilled" && r.value.ok);
}
