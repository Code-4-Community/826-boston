import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Default endpoint to retrieve application data',
    description: 'Retrieves default application data',
  })
  @Get()
  getData() {
    return this.appService.getData();
  }
}
