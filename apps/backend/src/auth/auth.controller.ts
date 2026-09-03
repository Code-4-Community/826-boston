import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { CreateManagedUserDto } from './dtos/create-managed-user.dto';
import { User } from '../users/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Get current authenticated user profile',
    description:
      'Returns the profile of the currently authenticated user based on the JWT token.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found in request context',
  })
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
  @ApiOperation({
    summary: 'Delete a user by ID',
    description:
      'Removes a user from both the database and Cognito user pool. Admin-only endpoint.',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'User not found or deletion failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'User not found',
        error: 'Bad Request',
      },
    },
  })
  @Delete('/admin/users')
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

  @ApiBearerAuth()
  @Post('/admin/users')
  @UserStatus(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new managed user',
    description:
      'Creates a new user in both the database and AWS Cognito user pool. Admin-only endpoint. ' +
      'The user will be created with the specified role and title. A temporary password will be generated.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully in database and Cognito',
    schema: {
      example: {
        id: 42,
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'standard',
        title: 'Editor',
      },
    },
  })
  @ApiConflictResponse({
    description: 'User already exists in database or Cognito',
    schema: {
      example: {
        statusCode: 409,
        message: 'User already exists in database',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or Cognito creation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Failed to create user in Cognito',
        error: 'Bad Request',
      },
    },
  })
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
