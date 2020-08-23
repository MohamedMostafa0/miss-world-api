import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthData, JwtLocalPayload } from './auth.dto';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthStrategyJwt extends PassportStrategy(Strategy) {

    constructor (config: { secret: string }) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.secret,
        });
    }

    async validate(payload: JwtLocalPayload) {
        return payload;
    }

}
