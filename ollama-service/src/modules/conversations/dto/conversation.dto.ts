import { IsEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import {  } from "@nestjs/swagger";

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export class UpdateConversationDto extends CreateConversationDto{
   /**
     * 主键id
     */
    @IsEmpty()
    @IsString()
    @IsUUID()
    id: string;
}