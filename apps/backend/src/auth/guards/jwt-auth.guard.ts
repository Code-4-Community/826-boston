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
