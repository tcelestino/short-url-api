import { Test, TestingModule } from '@nestjs/testing';
import { ShortenRepository } from '../../../../src/api/repositories/shorten.repository';
import { PrismaService } from '../../../../src/api/infra/prisma.service';

describe('ShortenRepository (integration)', () => {
  let repository: ShortenRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortenRepository, PrismaService],
    }).compile();

    repository = module.get<ShortenRepository>(ShortenRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  afterEach(async () => {
    await prisma.short.deleteMany();
  });

  describe('create', () => {
    it('should persist a new short url in the database', async () => {
      const result = await repository.create({ url: 'https://example.com' });

      expect(result.id).toBeDefined();
      expect(result.url).toBe('https://example.com');
      expect(result.shortCode).toMatch(/^[a-zA-Z0-9]{6}$/);
      expect(result.accessCount).toBe(0);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique shortCodes for different urls', async () => {
      const first = await repository.create({ url: 'https://first.com' });
      const second = await repository.create({ url: 'https://second.com' });

      expect(first.shortCode).not.toBe(second.shortCode);
    });
  });

  describe('findOne', () => {
    it('should return the entity when the shortCode exists', async () => {
      const created = await repository.create({ url: 'https://example.com' });

      const result = await repository.findOne(created.shortCode);

      expect(result).not.toBeNull();
      expect(result.shortCode).toBe(created.shortCode);
      expect(result.url).toBe('https://example.com');
      expect(result.accessCount).toBe(0);
    });

    it('should return null when the shortCode does not exist', async () => {
      const result = await repository.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findOneAndIncrementAccess', () => {
    it('should increment accessCount and return the updated entity', async () => {
      const created = await repository.create({ url: 'https://example.com' });

      const result = await repository.findOneAndIncrementAccess(
        created.shortCode,
      );

      expect(result).not.toBeNull();
      expect(result.accessCount).toBe(1);
    });

    it('should accumulate accessCount across multiple calls', async () => {
      const created = await repository.create({ url: 'https://example.com' });

      await repository.findOneAndIncrementAccess(created.shortCode);
      await repository.findOneAndIncrementAccess(created.shortCode);
      const result = await repository.findOneAndIncrementAccess(
        created.shortCode,
      );

      expect(result.accessCount).toBe(3);
    });

    it('should return null when the shortCode does not exist', async () => {
      const result =
        await repository.findOneAndIncrementAccess('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update the url and return the updated entity', async () => {
      const created = await repository.create({ url: 'https://original.com' });

      const result = await repository.update(created.shortCode, {
        url: 'https://updated.com',
      });

      expect(result).not.toBeNull();
      expect(result.url).toBe('https://updated.com');
      expect(result.shortCode).toBe(created.shortCode);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime(),
      );
    });

    it('should not change the accessCount on update', async () => {
      const created = await repository.create({ url: 'https://original.com' });
      await repository.findOneAndIncrementAccess(created.shortCode);

      const result = await repository.update(created.shortCode, {
        url: 'https://updated.com',
      });

      expect(result.accessCount).toBe(1);
    });

    it('should return null when the shortCode does not exist', async () => {
      const result = await repository.update('nonexistent', {
        url: 'https://updated.com',
      });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete the record and return true', async () => {
      const created = await repository.create({ url: 'https://example.com' });

      const result = await repository.remove(created.shortCode);

      expect(result).toBe(true);

      const deleted = await repository.findOne(created.shortCode);
      expect(deleted).toBeNull();
    });

    it('should return false when the shortCode does not exist', async () => {
      const result = await repository.remove('nonexistent');

      expect(result).toBe(false);
    });
  });
});
