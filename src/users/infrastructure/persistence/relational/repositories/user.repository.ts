import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../../../roles/domain/role';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { NewUser, User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: NewUser): Promise<User> {
    const { id } = await this.userRepository.save(
      this.userRepository.create(UserMapper.toPersistence(data)),
    );
    return UserMapper.toDomain(
      await this.userRepository.findOneOrFail({ where: { id } }),
    );
  }

  async findById(
    id: User['id'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { id },
      withDeleted: options?.withDeleted ?? false,
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(
    email: User['email'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { email },
      withDeleted: options?.withDeleted ?? false,
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async updateRole(
    id: User['id'],
    roleId: Role['id'],
  ): Promise<NullableType<User>> {
    await this.userRepository.update({ id }, { roleId });
    return this.findById(id);
  }
}
