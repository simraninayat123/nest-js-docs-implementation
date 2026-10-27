import { NullableType } from '../../../utils/types/nullable.type';
import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByEmail(
    email: User['email'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>>;
}
