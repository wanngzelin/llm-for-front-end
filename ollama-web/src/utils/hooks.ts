import { useState, useCallback } from "react";
import { type BubbleItemType } from "@ant-design/x";

export function useAuth() {
  const userInfo = sessionStorage.getItem('userInfo');
  const token = sessionStorage.getItem('token')
  if (userInfo && token) return true
  return false
}

export function useBubbleList(initialItems: BubbleItemType[] = []) {
  const [items, setItems] = useState<BubbleItemType[]>(initialItems);

  const add = useCallback((item: BubbleItemType) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback(
    (key: string | number, data: Omit<Partial<BubbleItemType>, 'key' | 'role'>) => {
      setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...data } : item)));
    },
    [],
  );

  return [items, setItems, add, update] as const;
}