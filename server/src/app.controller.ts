import { Controller, Get } from '@nestjs/common';

@Controller('base')
export class AppController {
  @Get('content')
  getBaseContent() {
    return { status: 200 };
  }
}
