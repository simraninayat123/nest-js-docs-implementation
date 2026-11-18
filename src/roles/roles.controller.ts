import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../permissions/permission.enum';
import { Role } from './domain/role';
import { SaveRoleDto } from './dto/save-role.dto';
import { RolesService } from './roles.service';

@Controller({ path: 'roles' })
@Auth(Permission.RolesManage)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: SaveRoleDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SaveRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
