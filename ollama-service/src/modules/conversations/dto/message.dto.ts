import { AIROLE } from '@/constants/constant.enum';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';

export class SendMessageDto {

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(AIROLE)
  role?: AIROLE
}