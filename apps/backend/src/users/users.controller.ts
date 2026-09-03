import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system.',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          title: 'Author',
          role: 'STANDARD',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieves a single user by their ID.',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    schema: {
      example: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        title: 'Author',
        role: 'STANDARD',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Get('/:userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Permanently removes a user from the system. Requires authentication.',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      example: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        title: 'Author',
        role: 'STANDARD',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found with the provided ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 999 not found',
        error: 'Not Found',
      },
    },
  })
  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
