import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ShortStateInfo {

    @ApiProperty()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    readonly code?: string;
}

export class ShortCountryInfo {

    @ApiProperty()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly code: string;

    @ApiProperty()
    readonly flag?: string;
}