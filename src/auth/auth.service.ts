import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { AuthData, JwtLocalPayload } from './auth.dto';
import { CreateAccountRequest } from './../user/dto/input.dto';
import { UserProfile } from './../user/dto/output.dto';
import { UserEntity } from './../user/entities';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {
    }

    async login(jwtLocalPayload: JwtLocalPayload): Promise<AuthData> {
        const token = this.jwtService.sign(jwtLocalPayload);
        return {
            profile: jwtLocalPayload.user,
            token,
        } as AuthData;
    }

    register(req: CreateAccountRequest) {
        return from(this.userService.create(req)).pipe(
            map(async (response) => {
                const user = await this.userService.findById(Number(response.identifiers[0].id)).toPromise();
                return user;
            }),
            map(async (user) => {
                const usr = await user;
                return this.auth(usr);
            }),
        );
    }

    private async auth(user: UserEntity) {
        const userProfile: UserProfile = await this.userService.profileDto(user);
        const payload: JwtLocalPayload = new JwtLocalPayload(userProfile);
        const token: string = this.jwtService.sign({ payload });
        return {
            profile: userProfile,
            token,
        } as AuthData;
    }
}
