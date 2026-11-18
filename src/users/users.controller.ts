import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Request,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../permissions/permission.enum';
import { User } from './domain/user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from './users.service';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/role')
  @Auth(Permission.UsersManage)
  @HttpCode(HttpStatus.OK)
  assignRole(
    @Request() request: { user: User },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRoleDto,
  ): Promise<User> {
    return this.usersService.assignRole(request.user, id, dto);
  }
}
