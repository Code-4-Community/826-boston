import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_STATUS } from '../roles.decorator';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/types';

@Injectable()
export class UserStatusGuard implements CanActivate {
  private readonly logger = new Logger(UserStatusGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatuses = this.reflector.getAllAndOverride<Role[]>(
      USER_STATUS,
      [context.getHandler(), context.getClass()],
    );

    // no decorator
    if (!requiredStatuses || requiredStatuses.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // no user
    if (!user || !user.role) {
      this.logger.warn(
        `UserStatusGuard: denied — no user or status on request (required: [${requiredStatuses.join(
          ', ',
        )}])`,
      );
      return false;
    }

    const allowed = requiredStatuses.includes(user.role);
    if (allowed) {
      this.logger.debug(
        `UserStatusGuard: granted — user status "${user.role}"`,
      );
    } else {
      this.logger.warn(
        `UserStatusGuard: denied — user status "${
          user.role
        }", required: [${requiredStatuses.join(', ')}]`,
      );
    }
    return allowed;
  }
}
