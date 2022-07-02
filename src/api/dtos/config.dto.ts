import { Config } from "../../piano/interfaces/config.interface.js";
import { RgbMode } from "../../piano/interfaces/rbg-mode.enum.js";

export class ConfigDto {
  rgbMode: RgbMode;
  colorRangeStart: number;
  colorRangeEnd: number;
  fixedHue: number;
  
  static fromModel(model: Config): ConfigDto {
    const dto = new ConfigDto();
    dto.rgbMode = RgbMode[model.rgbMode];
    dto.colorRangeStart = model.colorRangeStart;
    dto.colorRangeEnd = model.colorRangeEnd;
    dto.fixedHue = model.fixedHue;
    return dto;
  }
  
  static toModel(dto: ConfigDto): Config {
    return {
      rgbMode: RgbMode[dto.rgbMode],
      colorRangeStart: dto.colorRangeStart,
      colorRangeEnd: dto.colorRangeEnd,
      fixedHue: dto.fixedHue,
    }
  }
}