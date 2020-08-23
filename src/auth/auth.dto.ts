import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '../user/dto/output.dto';

export class LoginRequest {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1)
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1)
    readonly password: string;

}

export class JwtLocalPayload {
    readonly user: UserProfile;
    constructor(user: UserProfile) {
        this.user = user;
    }
}

export class AuthData {
    readonly profile: UserProfile;
    readonly token: string;
}
