import { atobItem } from "./storage";

export function useAuth() {
  const userInfo = atobItem('userInfo');
  const token = atobItem('token')
  if (userInfo && token) return true
  return false
}