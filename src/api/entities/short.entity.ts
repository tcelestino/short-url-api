import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Short {
  @ApiProperty({
    description: 'The unique identifier of the short URL',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The original URL',
    example: 'https://example.com',
  })
  url: string;

  @ApiProperty({
    description: 'The short code for the URL',
    example: 'abc123',
  })
  shortCode: string;

  @ApiProperty({
    description: 'The date and time the URL was created',
    example: '2025-05-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the URL was last updated',
    example: '2025-05-02T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The number of times the URL has been accessed',
    required: false,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  accessCount?: number;
}

export class CreateShortDTO {
  @ApiProperty({
    description: 'The original URL',
    example: 'https://example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class UpdateShortDTO {
  @ApiProperty({
    description: 'The new URL',
    example: 'https://example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
