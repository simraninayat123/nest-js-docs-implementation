import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { Role } from './domain/role';
import { SaveRoleDto } from './dto/save-role.dto';
import {
  RoleData,
  RoleRepository,
} from './infrastructure/persistence/role.repository';
import { SystemRole } from './system-role.enum';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(dto: SaveRoleDto): Promise<Role> {
    await this.assertNameAvailable(dto.name);
    return this.roleRepository.create(this.toRoleData(dto));
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  findById(id: Role['id']): Promise<NullableType<Role>> {
    return this.roleRepository.findById(id);
  }

  async findOne(id: Role['id']): Promise<Role> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          role: 'notFound',
        },
      });
    }

    return role;
  }

  async update(id: Role['id'], dto: SaveRoleDto): Promise<Role> {
    await this.assertEditable(id);
    await this.assertNameAvailable(dto.name, id);
    return this.roleRepository.update(id, this.toRoleData(dto));
  }

  async remove(id: Role['id']): Promise<void> {
    await this.assertEditable(id);
    await this.roleRepository.remove(id);
  }

  private async assertEditable(id: Role['id']): Promise<void> {
    const role = await this.findOne(id);

    if (Object.values<string>(SystemRole).includes(role.id)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          role: 'systemRoleReadOnly',
        },
      });
    }
  }

  private async assertNameAvailable(
    name: Role['name'],
    exceptId?: Role['id'],
  ): Promise<void> {
    const existing = await this.roleRepository.findByName(name);

    if (existing && existing.id !== exceptId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          name: 'nameAlreadyExists',
        },
      });
    }
  }

  private toRoleData(dto: SaveRoleDto): RoleData {
    return {
      name: dto.name,
      description: dto.description ?? null,
      permissions: dto.permissions,
    };
  }
}
