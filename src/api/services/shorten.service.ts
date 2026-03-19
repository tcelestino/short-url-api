import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Short,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';
import { ShortenRepository } from '../repositories/shorten.repository';

@Injectable()
export class ShortenService {
  constructor(private readonly shortenRepository: ShortenRepository) {}

  async create(createShortDto: CreateShortDTO): Promise<Short> {
    if (!createShortDto.url || createShortDto.url.trim() === '') {
      throw new Error('URL is required');
    }
    const { accessCount: _, ...result } = await this.shortenRepository.create(createShortDto);
    return result;
  }

  async getById(id: string): Promise<Short> {
    const short = await this.shortenRepository.findOneAndIncrementAccess(id);
    if (!short) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    const { accessCount: _, ...result } = short;
    return result;
  }

  async update(id: string, updateShortDto: UpdateShortDTO): Promise<Short> {
    const updatedShort = await this.shortenRepository.update(id, updateShortDto);
    if (!updatedShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    const { accessCount: _, ...result } = updatedShort;
    return result;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.shortenRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
  }

  async getStatsById(id: string): Promise<Short> {
    const statsShort = await this.shortenRepository.findOne(id);
    if (!statsShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return statsShort;
  }
}
