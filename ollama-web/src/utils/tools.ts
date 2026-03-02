// 获取最新的认证头（模拟 axios 请求拦截器）
export function getAuthHeaders(): Record<string, string> {
  // 根据你的实际 token 存储位置获取
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}