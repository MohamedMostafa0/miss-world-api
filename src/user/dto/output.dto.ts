import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { ShortCountryInfo, ShortStateInfo } from "../../location/dto/output.dto";
import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {

    @ApiProperty()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty()
    readonly birthdate?: number;

    @ApiProperty()
    readonly country?: ShortCountryInfo;

    @ApiProperty()
    readonly state?: ShortStateInfo;

    @ApiProperty()
    readonly city?: string;

    @ApiProperty()
    readonly phone?: string;
}

