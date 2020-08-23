import { createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtLocalPayload } from './auth.dto';

export const CurrentAuth = createParamDecorator((data: 'user' | 'sid', req: any) => {
    // if route is protected, there is a user set in auth.middleware
    if (!!req.user) {
        const payload: JwtLocalPayload = !!req.user.payload ? req.user.payload : req.user;
        return !!data ? payload[data] : req.user;
    }

    // in case a route is not protected, we still want to env the optional auth user from jwt
    const token = req.headers.authorization ? (req.headers.authorization as string).split(' ') : null;
    if (token && token[1]) {
        const payload: JwtLocalPayload = <JwtLocalPayload>jwt.verify(token[1], config.jwt.secret);
        return !!data ? payload[data] : payload;
    }
});

