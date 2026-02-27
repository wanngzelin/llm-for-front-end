export interface JwtPayload {
  /** 用户 ID */
  sub: string;
  /** 用户名 */
  userName: string;
}