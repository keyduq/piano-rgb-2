import { Module } from '@nestjs/common';
import { PianoService } from './piano.service.js';

@Module({
  providers: [PianoService],
  exports: [PianoService],
})
export class PianoModule {}
