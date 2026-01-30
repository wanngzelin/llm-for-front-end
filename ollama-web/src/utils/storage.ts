/**
 * 简单加密存储数据
 * @param key 
 * @param val 
 */
export function btoaItem(key: string, val: string) {
  sessionStorage.setItem(btoa(key), btoa(val))
}

/**
 * 解密获取数据
 * @param key 
 */
export function atobItem(key: string) {
  return sessionStorage.getItem(btoa(key))
}