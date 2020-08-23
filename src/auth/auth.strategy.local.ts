import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { from, iif } from 'rxjs';
import { throwWhenUnauthorized } from '../shared/rx';
import { AuthData, JwtLocalPayload } from './auth.dto';
import { UserService } from '../user/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class AuthStrategyLocal extends PassportStrategy(Strategy) {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        super();
    }

    private requestIP(@Req() req: Request) {
        if (!!req.ip) return req.ip;
        if (!!req.connection && !!req.connection.remoteAddress) return req.connection.remoteAddress;
        return req.header('x-forwarded-for');
    }

    validate(username: string, password: string): Promise<JwtLocalPayload | undefined> {
        return from(this.userService.findByCredentials(username, password))
            .pipe(
                throwWhenUnauthorized(),
                switchMap(user => this.userService.profileDto(user!)),
                map(user => ({ user, sid: 'sucks' } as JwtLocalPayload)),
            ).toPromise();
    }
}
