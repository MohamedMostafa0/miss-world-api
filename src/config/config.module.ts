import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { config } from './config';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(config),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
}
