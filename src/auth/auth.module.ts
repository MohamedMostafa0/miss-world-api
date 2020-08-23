import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseConfig } from '../config/database.config';
import { DatabaseAliases } from '../config/database.alias';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from '../config/config';
import { UserModule } from '../user/user.module';
import { AuthStrategyJwt } from './auth.strategy.jwt';
import { AuthStrategyLocal } from './auth.strategy.local';

@Module({
    imports: [
        DatabaseConfig.featureModuleNamed(DatabaseAliases.world),
        JwtModule.register({
            secret: config.jwt.secret,
            signOptions: { expiresIn: config.jwt.expiresIn }
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: AuthStrategyJwt,
            useValue: new AuthStrategyJwt({ secret: config.jwt.secret })
        },
        AuthStrategyLocal,
        AuthService
    ],
    exports: [AuthService]
})
export class AuthModule {
}
