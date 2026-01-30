import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { STATUS } from "@/constants/constant.enum";
import { IntersectionType, PartialType } from "@nestjs/swagger";
import { PagerDto } from "@/common/dto/page.dto";

export class CreateUserDto {
  /**
   * 用户名,长度限制：32个字符
   */
  @MinLength(6,{message:'最低长度6位'})
  @MaxLength(32,{message:'最大长度32位'})
  @IsString()
  userName: string;

  /**
   * 头像URL,长度限制：128个字符
   */
  @IsOptional()
  @IsString()
  avatar?: string;

  /**
   * 密码,长度限制：32个字符
   */
  @MaxLength(32, { message: '最长32个字符' })
  @MinLength(6,{message:'最低长度6位'})
  @IsString()
  password: string;

  /**
   * 状态,-1: 删除, 0: 正常, 1: 停用。默认值：0
   */
  @IsOptional()
  @IsEnum(STATUS, { message: '只能传入数字-1,1或0' })
  @IsNumber()
  status: STATUS;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * 主键id
   */
  @IsEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class UserQueryDto extends IntersectionType(PagerDto<CreateUserDto>, PartialType(CreateUserDto)) {

}