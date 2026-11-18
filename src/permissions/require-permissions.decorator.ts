import { Reflector } from '@nestjs/core';
import { Permission } from './permission.enum';

export const RequirePermissions = Reflector.createDecorator<Permission[]>();
