import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  // If this returns false, Nest will deny access to the route handler
  // Automatically throwing a Forbidden Exception (403 status code)
  canActivate(context: ExecutionContext): boolean {
    // Look for the metadata we set with the @Roles() decorator
    // Checks in the route handler, then the controller, and makes it undefined if nothing found
    // Routes take priority over controllers in terms of overriding
    const requiredRoles = this.reflector.getAllAndOverride<OmchaiRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method-level
        context.getClass(), // controller-level
      ],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
