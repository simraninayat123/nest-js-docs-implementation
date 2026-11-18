import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvidersEnum } from '../../../../auth/auth-providers.enum';
import { SystemRole } from '../../../../roles/system-role.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const admin = {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: null,
      provider: AuthProvidersEnum.email,
      roleId: SystemRole.Admin,
    };

    const exists = await this.repository.exists({
      where: { email: admin.email },
      withDeleted: true,
    });

    if (!exists) {
      await this.repository.save(this.repository.create(admin));
    }
  }
}
