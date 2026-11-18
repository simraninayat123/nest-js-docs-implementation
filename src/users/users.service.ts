import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { NullableType } from '../utils/types/nullable.type';
import { NewUser, User } from './domain/user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
  ) {}

  create(data: NewUser): Promise<User> {
    return this.userRepository.create(data);
  }

  findById(
    id: User['id'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>> {
    return this.userRepository.findById(id, options);
  }

  findByEmail(
    email: User['email'],
    options?: { withDeleted?: boolean },
  ): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email, options);
  }

  async assignRole(
    actor: User,
    id: User['id'],
    dto: AssignRoleDto,
  ): Promise<User> {
    if (actor.id === id) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'cannotChangeOwnRole',
        },
      });
    }

    if (!(await this.rolesService.findById(dto.roleId))) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          roleId: 'roleNotFound',
        },
      });
    }

    const user = await this.userRepository.updateRole(id, dto.roleId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          user: 'notFound',
        },
      });
    }

    return user;
  }
}
