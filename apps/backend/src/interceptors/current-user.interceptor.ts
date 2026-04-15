import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const cognitoPayload = request.user;

    if (!cognitoPayload || !cognitoPayload.email) {
      return handler.handle();
    }

    const users = await this.usersService.find(cognitoPayload.email);

    if (users.length > 0) {
      const user = users[0];

      request.user = user;
    }
    if (users.length === 0) {
      const newUser = await this.usersService.create(
        cognitoPayload.email,
        cognitoPayload.firstName || 'Unknown',
        cognitoPayload.lastName || 'Unknown',
        cognitoPayload.role || 'STANDARD',
        cognitoPayload.title || 'Unknown',
      );
      request.user = newUser;
    }

    return handler.handle();
  }
}
