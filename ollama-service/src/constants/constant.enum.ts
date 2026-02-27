export enum STATUS {
  NORMAL = 0, // 正常状态
  FREEZE = 1, // 冻结
  DELETED = -1, // 软删除状态
}

export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum AIROLE {
  USER = 'user',
  ASSISTANT = 'assistant',
}