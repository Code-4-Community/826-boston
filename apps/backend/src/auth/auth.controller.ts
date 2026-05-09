import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { CreateManagedUserDto } from './dtos/create-managed-user.dto';
import { User } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../users/types';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { Request } from 'express';
import { UserStatus } from './roles.decorator';

interface AuthenticatedUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'standard';
}

type GetUserRequest = Request & {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

type JwtUserRequest = Request & {
  user?: {
    id?: number;
    email?: string;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(CurrentUserInterceptor)
  @Get('/me')
  async me(@Req() request: GetUserRequest): Promise<AuthenticatedUserResponse> {
    const user = request.user;

    if (!user?.id) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role === Role.ADMIN ? 'admin' : 'standard',
    };
  }

  @ApiBearerAuth()
  @UserStatus(Role.ADMIN)
  @Post('/delete')
  async delete(@Body() body: DeleteUserDto): Promise<void> {
    const user = await this.usersService.findOne(body.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      await this.authService.deleteUser(user.email);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }

    this.usersService.remove(user.id);
  }

  /**
   * Creates a new managed user in the database and Cognito user pool
   * @param request The request object containing the user email
   * @param body The body object containing the user email, first name, last name, and role
   * @returns The user object
   */
  @ApiBearerAuth()
  @Post('/admin/users')
  @UserStatus(Role.ADMIN)
  async createManagedUser(
    @Req() request: JwtUserRequest,
    @Body() body: CreateManagedUserDto,
  ): Promise<User> {
    const existingUsers = await this.usersService.find(body.email);
    if (existingUsers.length > 0) {
      throw new ConflictException('User already exists in database');
    }

    try {
      await this.authService.createManagedUser(
        body.email,
        body.firstName,
        body.lastName,
        body.role,
        body.title,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'UsernameExistsException' ||
          error.name === 'AliasExistsException')
      ) {
        throw new ConflictException('User already exists in Cognito');
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create user in Cognito');
    }

    try {
      return await this.usersService.create(
        body.email,
        body.firstName,
        body.lastName,
        body.role,
        body.title,
      );
    } catch (error) {
      await this.authService.deleteUser(body.email).catch(() => undefined);

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create user in database');
    }
  }
}
