import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User> {
    return this.userRepository.create(data);
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.userRepository.findById(id);
  }

  findByEmail(
    email: User['email'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email, options);
  }
}
