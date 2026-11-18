import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/domain/user';
import { RequirePermissions } from './require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride(RequirePermissions, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    if (
      required.every((permission) => user.role.permissions.includes(permission))
    ) {
      return true;
    }

    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      errors: {
        permissions: 'missingPermissions',
      },
    });
  }
}
