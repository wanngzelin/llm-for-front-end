
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { STATUS } from '@/constants/constant.enum';

/**
 * 创建聊天模型的 DTO
 */
export class CreateChatModel {

  /**
   * Ollama中的模型名，如"llama3.2:3b"
   */
  @IsString({ message: '模型名称必须是字符串' })
  @MinLength(1, { message: '模型名称不能为空' })
  @MaxLength(100, { message: '模型名称长度不能超过100个字符' })
  modelName: string;

  /**
   * 随机概率，温度越大，随机概率越大，默认0.7
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '温度值必须是小数，最多2位小数' })
  @Min(0, { message: '温度值不能小于0' })
  @Max(2, { message: '温度值不能大于2' })
  temperature?: number;

  /**
   * 最大上下文限制，默认1024
   */
  @IsOptional()
  @IsNumber({}, { message: '最大上下文限制必须是数字' })
  @Min(1, { message: '最大上下文限制不能小于1' })
  maxTokens?: number;

  /**
   * 描述，限制长度128
   */
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(128, { message: '描述长度不能超过128个字符' })
  descrition?: string;

  /**
   * 是否为默认配置，默认false
   */
  @IsOptional()
  @IsBoolean({ message: '是否为默认配置必须是布尔值' })
  isDefault?: boolean;

   /**
     * 状态,-1: 删除, 0: 正常, 1: 停用。默认值：0
     */
    @IsOptional()
    @IsEnum(STATUS, { message: '只能传入数字-1,1或0' })
    @IsNumber()
    status: STATUS;
}

/**
 * 更新聊天模型的 DTO
 */
export class UpdateChatModel extends PartialType(CreateChatModel) {
  // 继承自 CreateChatModel，所有字段变为可选
  /**
   * 聊天模型ID
   */
  @IsString({ message: '聊天模型ID必须是字符串' })
  @MinLength(1, { message: '聊天模型ID不能为空' })
  @MaxLength(100, { message: '聊天模型ID长度不能超过100个字符' })
  id: string;
}