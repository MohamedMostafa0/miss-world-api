import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfig } from './config/database.config';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    ...DatabaseConfig.rootModules,
     AuthModule,
     LocationModule,
     UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
