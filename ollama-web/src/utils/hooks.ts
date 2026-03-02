import { useState, useCallback } from "react";
import { IExBubbleItemType } from "@/typeVo";

export function useAuth() {
  const userInfo = sessionStorage.getItem('userInfo');
  const token = sessionStorage.getItem('token')
  if (userInfo && token) return true
  return false
}

export function useBubbleList(initialItems: IExBubbleItemType[] = []) {
  const [items, setItems] = useState<IExBubbleItemType[]>(initialItems);

  const add = useCallback((item: IExBubbleItemType) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback(
    (key: string | number, data: Omit<Partial<IExBubbleItemType>, 'key' | 'role'>) => {
      setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...data } : item)));
    },
    [],
  );

  return [items, setItems, add, update] as const;
}