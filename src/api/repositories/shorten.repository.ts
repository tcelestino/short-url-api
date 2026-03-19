import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma.service';
import { Short, CreateShortDTO, UpdateShortDTO } from '../entities/short.entity';

@Injectable()
export class ShortenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<Short | null> {
    const record = await this.prisma.short.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!record) return null;
    return this.toEntity(record);
  }

  async findOneAndIncrementAccess(id: string): Promise<Short | null> {
    try {
      const record = await this.prisma.short.update({
        where: { id: parseInt(id, 10) },
        data: { accessCount: { increment: 1 } },
      });
      return this.toEntity(record);
    } catch {
      return null;
    }
  }

  async create(createShortDto: CreateShortDTO): Promise<Short> {
    const record = await this.prisma.short.create({
      data: { url: createShortDto.url },
    });
    return this.toEntity(record);
  }

  async update(id: string, updateShortDto: UpdateShortDTO): Promise<Short | null> {
    try {
      const record = await this.prisma.short.update({
        where: { id: parseInt(id, 10) },
        data: { url: updateShortDto.url, updatedAt: new Date() },
      });
      return this.toEntity(record);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.short.delete({
        where: { id: parseInt(id, 10) },
      });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(record: {
    id: number;
    url: string;
    shortCode: string;
    createdAt: Date;
    updatedAt: Date;
    accessCount: number;
  }): Short {
    return {
      id: record.id.toString(),
      url: record.url,
      shortCode: record.shortCode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      accessCount: record.accessCount,
    };
  }
}
