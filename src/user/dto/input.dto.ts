import { IsNotEmpty, IsString, IsOptional, Allow, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateAccountRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly countryId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly stateId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly dateOfBirth?: number;
}
