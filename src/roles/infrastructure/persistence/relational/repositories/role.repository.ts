import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Role } from '../../../../domain/role';
import { SystemRole } from '../../../../system-role.enum';
import { RoleData, RoleRepository } from '../../role.repository';
import { RoleEntity } from '../entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class RoleRelationalRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(data: RoleData): Promise<Role> {
    const newEntity = await this.roleRepository.save(
      this.roleRepository.create(data),
    );
    return RoleMapper.toDomain(newEntity);
  }

  async findAll(): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      order: { createdAt: 'ASC' },
    });
    return entities.map((entity) => RoleMapper.toDomain(entity));
  }

  async findById(id: Role['id']): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findByName(name: Role['name']): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({ where: { name } });
    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async update(id: Role['id'], data: RoleData): Promise<Role> {
    await this.roleRepository.update({ id }, data);
    return RoleMapper.toDomain(
      await this.roleRepository.findOneOrFail({ where: { id } }),
    );
  }

  async remove(id: Role['id']): Promise<void> {
    await this.roleRepository.manager.transaction(async (manager) => {
      await manager.update(
        UserEntity,
        { roleId: id },
        { roleId: SystemRole.User },
      );
      await manager.delete(RoleEntity, { id });
    });
  }
}
