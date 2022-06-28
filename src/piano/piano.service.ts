import { Injectable, Logger } from '@nestjs/common';
import { JSONFile, Low } from 'lowdb';
import midi from 'midi';
import { join } from 'path';
import { DB } from './interfaces/db.interface.js';
import { RgbMode } from './interfaces/rbg-mode.enum.js';
import { SerialPort } from 'serialport';
import { setTimeout } from 'timers/promises';
import Color from 'color';

/**
 * Service that control the piano midi and serial port
 */
@Injectable()
export class PianoService {
  private logger = new Logger(PianoService.name);
  private db: Low<DB>;
  private input: midi.Input
  private output: midi.Output;
  private isOff: boolean;
  private serialPort: SerialPort;
  private lastColorSent: Color;

  constructor() {
    this.serialPort = new SerialPort({
      path: 'COM3',
      baudRate: 9600,
    }, err => {
      if (err) {
        this.logger.error(err);
      }
    })
    this.serialPort.on('open', async () => {
      await setTimeout(2000); // wait for serial port
      this.midiSetup();
      this.logger.log('Serial port and midi setted up.');
    })
    this.initDatabase();
  }
  
  /**
   * Initialize a file database located in /db/db.json
   */
  private async initDatabase() {
    const path = join(process.cwd(), 'db', 'db.json');
    const adapter = new JSONFile<DB>(path);
    this.db = new Low<DB>(adapter);
    await this.db.read();
  }
  /**
   * Get the current color range start
   * @returns {number} Color range start number
   */
  getColorRangeStart(): number {
    return this.db.data.config.colorRangeStart;
  }
  
  async setColorRangeStart(rangeStart: number): Promise<void> {
    this.db.data.config.colorRangeStart = rangeStart;
    return this.db.write();
  }
  
  getRgbMode(): RgbMode {
    const rgbMode = this.db.data.config.rgbMode;
    return RgbMode[rgbMode];
  }
  
  async setRgbMode(rgbMode: RgbMode): Promise<void> {
    this.db.data.config.rgbMode = RgbMode[rgbMode];
    return this.db.write();
  }
  
  getFixedHue(): number {
    return this.db.data.config.fixedHue;
  }
  
  async setFixedHue(fixedHue: number): Promise<void> {
    this.db.data.config.fixedHue = fixedHue;
    this.db.write();
    const color = Color.hsl([fixedHue, 100, 50]);
    this.sendColor(color);
  }
  
  checkMidi(): { available: boolean, casioPort: number, loopmidiPort: number } {
    const casio = this.getPort(this.input, 'CASIO');
    const loopmidi = this.getPort(this.output, 'loopmidi');
    return {
      available: casio >= 0 && loopmidi >= 0,
      casioPort: casio,
      loopmidiPort: loopmidi,
    }
  }

  async keepChecking() {
    const { available } = this.checkMidi();
    if (!available) {
      this.midiSetup();
    }
    await setTimeout(5000);
    this.keepChecking();
  }

  async midiSetup(): Promise<void> {
    this.input = new midi.Input();
    this.output = new midi.Output();
    const { available, casioPort, loopmidiPort } = this.checkMidi();
    if (!available) {
      // not available
      if (!this.isOff) {
        this.sendColor(Color('black'));
      }
      this.isOff = true;
      await setTimeout(5000);
      this.midiSetup();
      return;
    }
    this.isOff = false;
    this.input.on('message', (_, msg) => {
      const rgbMode = this.getRgbMode();
      this.output.sendMessage(msg);
      if (rgbMode == RgbMode.fixedColor) {
        // fixed color
        return;
      }
      let hue: number;
      if (msg[0] == 144) { 
        const key = msg[1] - 21;
        switch(rgbMode) {
          case RgbMode.colorRange:
            hue = (this.getColorRangeStart() + key / 1.25);
          break;
          case RgbMode.spectrum:
          default:
            hue = key / 88 * 360;
        }
        const color = Color.hsl([hue, 100, 50]);
        this.sendColor(color);
      }
    })
    this.input.openPort(casioPort);
    this.output.openPort(loopmidiPort);
    this.keepChecking();
  }
    
  getPort(inout: midi.Input | midi.Output, textLookup: string): number {
    for (let i = 0; i < inout.getPortCount(); i++) {
      if (inout.getPortName(i).includes(textLookup)) {
        return i;
      }
    }
    return -1;
  }
  
  sendColor(color: Color) {
    const data = `${color.red().toFixed()},${color.green().toFixed()},${color.blue().toFixed()}\n`;
    this.lastColorSent = color;
    this.serialPort.write(data, err => {
      if (err) {
        this.logger.error(err);
      }
    });
  }
}
