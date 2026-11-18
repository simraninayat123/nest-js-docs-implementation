import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../role.repository';
import { RoleEntity } from './entities/role.entity';
import { RoleRelationalRepository } from './repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: RoleRepository,
      useClass: RoleRelationalRepository,
    },
  ],
  exports: [RoleRepository],
})
export class RelationalRolePersistenceModule {}
