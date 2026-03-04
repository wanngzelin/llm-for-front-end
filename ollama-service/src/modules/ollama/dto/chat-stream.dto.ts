import { AIROLE } from "@/constants/constant.enum"
import { IsEnum, IsString, IsOptional, IsNumber, IsBoolean, IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class MessageDto {
  @IsEnum(AIROLE, { message: '角色必须是user或assistant' })
  role: AIROLE;
  
  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '会话ID不能为空' })
  conversationId:string;
}

export class ModelConfigDto {
  @IsString({ message: '模型名称必须是字符串' })
  @IsNotEmpty({ message: '模型名称不能为空' })
  model: string;
  
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '温度值必须是小数，最多2位小数' })
  temperature?: number;
  
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'topP值必须是小数，最多2位小数' })
  topP?: number;
  
  @IsOptional()
  @IsBoolean({ message: 'think必须是布尔值' })
  think?: boolean;
}

export class ChatStreamDto {
  @IsNotEmpty({ message: '消息不能为空' })
  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @IsNotEmpty({ message: '模型配置不能为空' })
  @ValidateNested()
  @Type(() => ModelConfigDto)
  modelConfig: ModelConfigDto;
}