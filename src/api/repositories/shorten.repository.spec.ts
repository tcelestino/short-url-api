import { Test, TestingModule } from '@nestjs/testing';
import { ShortenRepository } from './shorten.repository';
import { PrismaService } from '../infra/prisma.service';

describe('ShortenRepository', () => {
  let repository: ShortenRepository;
  let prisma: PrismaService;

  const now = new Date();

  const mockRecord = {
    id: 1,
    url: 'https://example.com',
    shortCode: 'abc123',
    createdAt: now,
    updatedAt: now,
    accessCount: 0,
  };

  const expectedEntity = {
    id: '1',
    url: 'https://example.com',
    shortCode: 'abc123',
    createdAt: now,
    updatedAt: now,
    accessCount: 0,
  };

  const mockPrismaService = {
    short: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ShortenRepository>(ShortenRepository);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the entity when the record exists', async () => {
      mockPrismaService.short.findUnique.mockResolvedValue(mockRecord);
      const result = await repository.findOne('abc123');
      expect(result).toEqual(expectedEntity);
      expect(mockPrismaService.short.findUnique).toHaveBeenCalledWith({
        where: { shortCode: 'abc123' },
      });
    });

    it('should return null when the record does not exist', async () => {
      mockPrismaService.short.findUnique.mockResolvedValue(null);
      const result = await repository.findOne('notfound');
      expect(result).toBeNull();
    });
  });

  describe('findOneAndIncrementAccess', () => {
    it('should return the entity with incremented accessCount', async () => {
      const updatedRecord = { ...mockRecord, accessCount: 1 };
      mockPrismaService.short.update.mockResolvedValue(updatedRecord);
      const result = await repository.findOneAndIncrementAccess('abc123');
      expect(result).toEqual({ ...expectedEntity, accessCount: 1 });
      expect(mockPrismaService.short.update).toHaveBeenCalledWith({
        where: { shortCode: 'abc123' },
        data: { accessCount: { increment: 1 } },
      });
    });

    it('should return null when the record does not exist', async () => {
      mockPrismaService.short.update.mockRejectedValue(new Error('not found'));
      const result = await repository.findOneAndIncrementAccess('notfound');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return the entity', async () => {
      mockPrismaService.short.create.mockResolvedValue(mockRecord);
      const result = await repository.create({ url: 'https://example.com' });
      expect(result).toEqual(expectedEntity);
      expect(mockPrismaService.short.create).toHaveBeenCalledWith({
        data: {
          url: 'https://example.com',
          shortCode: expect.any(String),
        },
      });
    });

    it('should generate a shortCode with 6 alphanumeric characters', async () => {
      mockPrismaService.short.create.mockResolvedValue(mockRecord);
      await repository.create({ url: 'https://example.com' });
      const callArg = mockPrismaService.short.create.mock.calls[0][0];
      expect(callArg.data.shortCode).toMatch(/^[a-zA-Z0-9]{6}$/);
    });
  });

  describe('update', () => {
    it('should update and return the entity', async () => {
      const updatedRecord = {
        ...mockRecord,
        url: 'https://updated.com',
        updatedAt: now,
      };
      mockPrismaService.short.update.mockResolvedValue(updatedRecord);
      const result = await repository.update('abc123', {
        url: 'https://updated.com',
      });
      expect(result).toEqual({ ...expectedEntity, url: 'https://updated.com' });
      expect(mockPrismaService.short.update).toHaveBeenCalledWith({
        where: { shortCode: 'abc123' },
        data: { url: 'https://updated.com', updatedAt: expect.any(Date) },
      });
    });

    it('should return null when the record does not exist', async () => {
      mockPrismaService.short.update.mockRejectedValue(new Error('not found'));
      const result = await repository.update('notfound', {
        url: 'https://updated.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return true when the record is removed successfully', async () => {
      mockPrismaService.short.delete.mockResolvedValue(mockRecord);
      const result = await repository.remove('abc123');
      expect(result).toBe(true);
      expect(mockPrismaService.short.delete).toHaveBeenCalledWith({
        where: { shortCode: 'abc123' },
      });
    });

    it('should return false when the record does not exist', async () => {
      mockPrismaService.short.delete.mockRejectedValue(new Error('not found'));
      const result = await repository.remove('notfound');
      expect(result).toBe(false);
    });
  });
});
