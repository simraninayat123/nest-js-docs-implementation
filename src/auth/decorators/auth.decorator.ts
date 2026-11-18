import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '../../permissions/permission.enum';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/require-permissions.decorator';

export const Auth = (...permissions: Permission[]) =>
  applyDecorators(
    RequirePermissions(permissions),
    UseGuards(AuthGuard('jwt'), PermissionsGuard),
  );
