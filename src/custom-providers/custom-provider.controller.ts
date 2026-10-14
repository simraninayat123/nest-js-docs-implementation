import { Controller, Get } from '@nestjs/common';
import { CustomProviderService } from './custom-provider.service';

@Controller('custom-providers')
export class CatsController {
  constructor(private readonly customProviderService: CustomProviderService) {}

  @Get()
  getProviderExamples() {
    return this.customProviderService.getExamples();
  }
}
