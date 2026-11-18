import { Role } from '../../../roles/domain/role';
import { NullableType } from '../../../utils/types/nullable.type';
import { NewUser, User } from '../../domain/user';

export abstract class UserRepository {
  abstract create(data: NewUser): Promise<User>;

  abstract findById(
    id: User['id'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>>;

  abstract findByEmail(
    email: User['email'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>>;

  abstract updateRole(
    id: User['id'],
    roleId: Role['id'],
  ): Promise<NullableType<User>>;
}
