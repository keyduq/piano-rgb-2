import { Test, TestingModule } from '@nestjs/testing';
import { PianoService } from './piano.service.js';

describe('PianoService', () => {
  let service: PianoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PianoService],
    }).compile();

    service = module.get<PianoService>(PianoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
