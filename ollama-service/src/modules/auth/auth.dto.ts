import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "../user/dto/user.dto";

export class ValidateUser extends PickType(CreateUserDto, ['password', 'userName'] as const) {

}