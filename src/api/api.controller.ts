import { BadRequestException, Body, Controller, Get, Put } from '@nestjs/common';
import { Config } from '../piano/interfaces/config.interface.js';
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
    const config = this.pianoService.getConfig();
    return ConfigDto.fromModel(config);
  }
  
  @Put('/config')
  async putConfig(@Body() body: ConfigDto): Promise<{ success: boolean, data: ConfigDto }> {
    if (body.rgbMode == undefined || body.colorRangeStart == undefined || body.fixedHue == undefined) {
      throw new BadRequestException('Check all the properties');
    }
    if (body.colorRangeStart != undefined && body.colorRangeEnd != undefined && body.colorRangeStart > body.colorRangeEnd) {
      // assure end is greater than start
      throw new BadRequestException('Color range start should be less than color range end');
    } else if (body.colorRangeStart != undefined && body.colorRangeEnd == undefined) {
      // default +60 for end if not set
      body.colorRangeEnd = body.colorRangeStart + 60; 
    } else if (body.colorRangeEnd != undefined && body.colorRangeStart == undefined) {
      // default -60 for start if not set
      body.colorRangeStart = body.colorRangeStart - 60;
    }
    const config: Config = {
      rgbMode: RgbMode[body.rgbMode],
      colorRangeStart: body.colorRangeStart,
      colorRangeEnd: body.colorRangeEnd,
      fixedHue: body.fixedHue,
    }
    await this.pianoService.setConfig(config);
    return {
      success: true,
      data: ConfigDto.fromModel(config),
    }
  }
}
