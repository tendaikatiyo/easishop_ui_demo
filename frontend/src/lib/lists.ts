import { getUser, saveUser } from "@/lib/storage";
import type { ShoppingList } from "@/types";

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getLists(): ShoppingList[] {
  return getUser().lists;
}

export function getDefaultList(): ShoppingList {
  const lists = getLists();
  return lists[0] ?? createList("My list");
}

export function createList(name: string): ShoppingList {
  const user = getUser();
  const list: ShoppingList = {
    id: uid("list"),
    name,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  user.lists = [list, ...user.lists];
  saveUser(user);
  return list;
}

export function renameList(listId: string, name: string): void {
  const user = getUser();
  user.lists = user.lists.map((l) =>
    l.id === listId ? { ...l, name, updatedAt: new Date().toISOString() } : l
  );
  saveUser(user);
}

export function deleteList(listId: string): void {
  const user = getUser();
  user.lists = user.lists.filter((l) => l.id !== listId);
  saveUser(user);
}

export function isInAnyList(productId: string): boolean {
  return getLists().some((l) => l.items.some((i) => i.productId === productId));
}

export function isInList(listId: string, productId: string): boolean {
  const list = getLists().find((l) => l.id === listId);
  return !!list?.items.some((i) => i.productId === productId);
}

export function addToList(productId: string, listId?: string): ShoppingList {
  const user = getUser();
  const targetId = listId ?? user.lists[0]?.id;
  if (!targetId) {
    const created = createList("Weekly shop");
    return addToList(productId, created.id);
  }

  user.lists = user.lists.map((list) => {
    if (list.id !== targetId) return list;
    if (list.items.some((i) => i.productId === productId)) return list;
    return {
      ...list,
      items: [
        ...list.items,
        { productId, addedAt: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    };
  });
  saveUser(user);
  return user.lists.find((l) => l.id === targetId)!;
}

export function removeFromList(productId: string, listId?: string): void {
  const user = getUser();
  user.lists = user.lists.map((list) => {
    if (listId && list.id !== listId) return list;
    if (!listId && !list.items.some((i) => i.productId === productId)) {
      return list;
    }
    return {
      ...list,
      items: list.items.filter((i) => i.productId !== productId),
      updatedAt: new Date().toISOString(),
    };
  });
  saveUser(user);
}

export function toggleInList(listId: string, productId: string): boolean {
  if (isInList(listId, productId)) {
    removeFromList(productId, listId);
    return false;
  }
  addToList(productId, listId);
  return true;
}

export function toggleInDefaultList(productId: string): boolean {
  if (isInAnyList(productId)) {
    removeFromList(productId);
    return false;
  }
  addToList(productId);
  return true;
}

export function totalListItems(): number {
  return getLists().reduce((sum, list) => sum + list.items.length, 0);
}
