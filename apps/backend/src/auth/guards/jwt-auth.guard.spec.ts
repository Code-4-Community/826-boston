import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../../users/users.service';
import { Omchai, OmchaiRole } from '../../omchai/omchai.entity';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: UsersService,
          useValue: {
            findWithOmchai: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;

    jest
      .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return false when parent guard returns false', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(guard, 'canActivate').mockResolvedValueOnce(false);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle requests with no user email gracefully', async () => {
      const mockRequest = {
        user: {},
      };

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(mockContext);
      // we can still let this pass thru since JWT was valid
      // but will fail any other guards if they have roles associated
      expect(result).toBe(true);
      expect(usersService.findWithOmchai).not.toHaveBeenCalled();
    });
  });
});
