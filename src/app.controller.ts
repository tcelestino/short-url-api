import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get service status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service health status',
    example: { status: 'OK', timestamp: new Date().toISOString() },
  })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
