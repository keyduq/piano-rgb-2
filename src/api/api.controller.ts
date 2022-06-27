import { Body, Controller, Get, Put } from '@nestjs/common';
import { RgbMode } from '../piano/interfaces/rbg-mode.enum.js';
import { PianoService } from '../piano/piano.service.js';
import { ConfigDto } from './dtos/config.dto.js';

@Controller('api')
export class ApiController {
  constructor(private readonly pianoService: PianoService) {}
  
  @Get('/modes')
  async getColorModes(): Promise<string[]> {
    return Object.values(RgbMode);
  }

  @Get('/config')
  async getConfig(): Promise<ConfigDto> {
    const rgbMode = this.pianoService.getRgbMode();
    const colorRangeStart = this.pianoService.getColorRangeStart();
    return {
      rgbMode,
      colorRangeStart,
    }
  }
  
  @Put('/config')
  async putConfig(@Body() body: ConfigDto): Promise<{ success: boolean, data: ConfigDto }> {
    await this.pianoService.setRgbMode(body.rgbMode);
    await this.pianoService.setColorRangeStart(body.colorRangeStart);
    return {
      success: true,
      data: body,
    }
  }
}
