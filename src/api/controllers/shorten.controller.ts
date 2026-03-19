import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ShortenService } from '../services/shorten.service';
import {
  Short,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';

@ApiTags('shorten')
@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiBody({ type: CreateShortDTO })
  @ApiResponse({ status: HttpStatus.CREATED, type: Short })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async createShort(@Body() createShortDto: CreateShortDTO): Promise<Short> {
    return this.shortenService.create(createShortDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a short URL by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Short })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getShortById(@Param('id') id: string): Promise<Short> {
    return this.shortenService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a short URL by ID' })
  @ApiBody({ type: UpdateShortDTO })
  @ApiResponse({ status: HttpStatus.OK, type: Short })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async updateShort(
    @Param('id') id: string,
    @Body() updateShortDto: UpdateShortDTO,
  ): Promise<Short> {
    return this.shortenService.update(id, updateShortDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a short URL by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async deleteShort(@Param('id') id: string): Promise<void> {
    return this.shortenService.delete(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get stats for a short URL by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Short })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getStatsById(@Param('id') id: string): Promise<Short> {
    return this.shortenService.getStatsById(id);
  }
}
