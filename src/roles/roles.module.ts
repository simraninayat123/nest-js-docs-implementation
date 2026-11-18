import { Module } from '@nestjs/common';
import { RelationalRolePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [RelationalRolePersistenceModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
