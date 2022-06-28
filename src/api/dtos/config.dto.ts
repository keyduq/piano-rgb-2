import { RgbMode } from "../../piano/interfaces/rbg-mode.enum.js";

export interface ConfigDto {
  rgbMode: RgbMode;
  colorRangeStart: number;
  fixedHue: number;
}