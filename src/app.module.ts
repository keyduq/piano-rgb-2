import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PianoModule } from './piano/piano.module.js';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PianoModule } from './piano/piano.module';
// import { ApiModule } from './api/api.module';

@Module({
  imports: [PianoModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
