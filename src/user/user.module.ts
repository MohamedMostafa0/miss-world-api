import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
// import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from '../config/config';
import { ConfigService } from '../config/config.service';
// import { AuthService } from './auth.service';
import { AuthStrategyLocal } from '../auth/auth.strategy.local';
import { AuthStrategyJwt } from '../auth/auth.strategy.jwt';
import { LocationService } from '../location/location.service';
import { DatabaseConfig } from '../config/database.config';
import { DatabaseAliases } from '../config/database.alias';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        DatabaseConfig.featureModuleNamed(DatabaseAliases.world),
        JwtModule.register({
            secret: config.jwt.secret,
            signOptions: { expiresIn: config.jwt.expiresIn }
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        forwardRef(() => AuthModule),
    ],
    exports: [
        UserService
    ],
    controllers: [
        UserController,
        // AuthController,
    ],
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(config)
        },
        {
            provide: AuthStrategyJwt,
            useValue: new AuthStrategyJwt({ secret: config.jwt.secret })
        },
        AuthStrategyLocal,
        UserService,
        LocationService,
    ]
})
export class UserModule {
}
