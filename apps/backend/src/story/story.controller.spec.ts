import { AnthologyService } from '../anthology/anthology.service';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author/author.service';
import { StoriesSeed } from '../seeds/stories.seed';

describe('StoryController', () => {
  let controller: StoryController;

  const mockService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    getStoriesByAnthology: jest.fn(),
    findByTitle: jest.fn(),
    findByTheme: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByAnthologyAndId: jest.fn(),
    createStory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [
        { provide: StoryService, useValue: mockService },
        {
          provide: AnthologyService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AuthorService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoryController>(StoryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get stories by anthology', () => {
    it('get stories given anthology id', () => {
      mockService.getStoriesByAnthology.mockResolvedValue([StoriesSeed[0]]);
      const result = controller.getStoriesByAnthology(999);
      expect(result).resolves.toEqual([StoriesSeed[0]]);
      expect(mockService.getStoriesByAnthology).toHaveBeenCalledWith(999);
    });
  });

  // todo: other tests
});
