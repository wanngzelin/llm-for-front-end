import { AIROLE } from '@/constants/constant.enum';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, IsEmpty, IsNumber } from 'class-validator';

export class SendMessageDto {

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  think?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  thinkDuration?: number

  @IsOptional()
  @IsEnum(AIROLE)
  role?: AIROLE
}

export class UpdateMsgDto extends SendMessageDto {
  /**
    * 主键id
    */
  @IsEmpty()
  @IsString()
  @IsUUID()
  id: string;
}