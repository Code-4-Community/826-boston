import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { mockUser } from './users.service.spec';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        CurrentUserInterceptor,
      ],
    })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({})
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      mockUsersService.findAll.mockReturnValue([mockUser]);

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getUser(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', () => {
      mockUsersService.remove.mockReturnValue(mockUser);

      const result = controller.removeUser(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});
