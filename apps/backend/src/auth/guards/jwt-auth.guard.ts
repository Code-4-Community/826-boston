import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    let result: boolean;
    try {
      result = await (super.canActivate(context) as Promise<boolean>);
    } catch (err) {
      this.logger.warn(
        `JWT validation failed for ${method} ${url}: ${err.message}`,
      );
      throw err;
    }

    if (!result) {
      this.logger.warn(`JWT guard denied ${method} ${url}`);
      return false;
    }

    const email = request.user?.email;
    if (email) {
      const users = await this.usersService.findWithOmchai(email);
      if (users.length > 0) {
        request.user = users[0];
        this.logger.debug(`Authenticated user ${email} for ${method} ${url}`);
      } else {
        this.logger.warn(`JWT valid but no user found for email ${email}`);
      }
    }

    return result;
  }
}
