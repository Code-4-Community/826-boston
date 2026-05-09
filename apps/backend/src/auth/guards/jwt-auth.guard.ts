import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { IS_PUBLIC_KEY } from '../roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      try {
        await (super.canActivate(context) as Promise<boolean>);
      } catch {
        /* empty */
      }
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    try {
      const result = await (super.canActivate(context) as Promise<boolean>);

      if (!result) {
        this.logger.warn(`JWT guard denied ${method} ${url}`);
      }

      return result;
    } catch (err) {
      this.logger.warn(
        `JWT validation failed for ${method} ${url}: ${err.message}`,
      );
      throw err;
    }
  }
}
