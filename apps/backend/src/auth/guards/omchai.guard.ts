import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OMCHAI_ROLES } from '../roles.decorator';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class OmchaiGuard implements CanActivate {
  private readonly logger = new Logger(OmchaiGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<OmchaiRole[]>(
      OMCHAI_ROLES,
      [context.getHandler(), context.getClass()],
    );

    // no decorator
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // no omchai
    if (!user || !user.omchaiAssignments) {
      this.logger.warn(
        `OmchaiGuard: denied — user has no omchai assignments (required: [${requiredRoles.join(
          ', ',
        )}])`,
      );
      return false;
    }

    const params = request.params;
    // INVARIANT: anthology must always be passed in as "id" or "anthologyId"
    const anthologyId = parseInt(params.id ?? params.anthologyId);

    if (isNaN(anthologyId)) {
      this.logger.warn(
        `OmchaiGuard: route requires roles [${requiredRoles.join(
          ', ',
        )}] but no anthology ID found in params`,
      );
      return false;
    }

    const assignment = user.omchaiAssignments.find(
      (a) => a.anthologyId === anthologyId,
    );

    const allowed = !!assignment && requiredRoles.includes(assignment.role);
    if (allowed) {
      this.logger.debug(
        `OmchaiGuard: granted — user role "${assignment.role}" on anthology ${anthologyId}`,
      );
    } else {
      this.logger.warn(
        `OmchaiGuard: denied — user has role "${
          assignment?.role ?? 'none'
        }" on anthology ${anthologyId}, required: [${requiredRoles.join(
          ', ',
        )}]`,
      );
    }
    return allowed;
  }
}
