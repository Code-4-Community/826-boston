import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../users/types';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {};

    const mockUsersService = {
      create: jest.fn(),
      findWithOmchai: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns the current user assignment count', async () => {
    const user = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      role: Role.STANDARD,
    };
    const request = { user } as Parameters<typeof controller.me>[0];

    jest
      .spyOn(controller['usersService'], 'findWithOmchai')
      .mockResolvedValue([
        { ...user, omchaiAssignments: new Array(2).fill(null) },
      ]);

    await expect(controller.me(request)).resolves.toMatchObject({
      id: user.id,
      omchaiAssignmentCount: 2,
    });
  });
});
