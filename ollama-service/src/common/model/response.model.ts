import { ApiProperty } from '@nestjs/swagger'

import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
  RESPONSE_SUCCESS
} from '@/constants/response.constant'

export class ResultData<T = any> {
  @ApiProperty({ type: 'object', additionalProperties: true })
  data?: T

  @ApiProperty({ type: 'number', default: RESPONSE_SUCCESS_CODE })
  code: number

  @ApiProperty({ type: 'string', default: RESPONSE_SUCCESS_MSG })
  message: string

  @ApiProperty({ type: 'boolean', default: RESPONSE_SUCCESS })
  success: boolean

  constructor(code: number, data: T, success = RESPONSE_SUCCESS, message = RESPONSE_SUCCESS_MSG) {
    this.code = code
    this.data = data
    this.success = success
    this.message = message
  }

  static success<T>(data?: T, success?: boolean, message?: string) {
    return new ResultData(RESPONSE_SUCCESS_CODE, data, success, message)
  }

  static error(code: number, message = '请求失败') {
    return new ResultData(code, null, false, message)
  }
}

export class TreeResult<T> {
  @ApiProperty()
  id: number

  @ApiProperty()
  parentId: number

  @ApiProperty()
  children?: TreeResult<T>[]
}