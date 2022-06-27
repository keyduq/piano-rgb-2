import { Module } from '@nestjs/common';
import { PianoModule } from '../piano/piano.module.js';
import { ApiController } from './api.controller.js';

@Module({
  imports: [PianoModule],
  controllers: [ApiController],
  
})
export class ApiModule {}
