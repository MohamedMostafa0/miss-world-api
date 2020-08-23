import { Controller, Post, UseGuards, HttpStatus, HttpCode, Body, Req,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserProfile } from '../user/dto/output.dto';
import { LoginRequest, JwtLocalPayload } from './auth.dto';
import { CurrentAuth } from './auth.user.decorator';
import { Request } from 'express';
import { CreateAccountRequest } from './../user/dto/input.dto';
import { HttpErrors } from './../shared/http-exception-custom';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @ApiOperation({ description: 'Login user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Authenticated successfully',
        type: UserProfile,
    })
    @ApiResponse({ status: HttpErrors.LOGIN_ERROR, description: 'Login Failed' })
    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    @Post('login')
    // to-do: add user IP and add login history record
    login(@Body() params: LoginRequest, @CurrentAuth() authPayload: JwtLocalPayload, @Req() req: Request) {
        return this.authService.login(authPayload);
    }

    @ApiOperation({ description: 'Create new user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Created successfully',
        type: UserProfile,
    })
    @ApiResponse({ status: HttpErrors.REGISTER_ERROR_USERNAME, description: 'Register Failed' })
    @ApiResponse({ status: HttpErrors.REGISTER_ERROR, description: 'Register Failed' })
    @ApiResponse({ status: HttpErrors.REGISTER_ERROR_EMAIL, description: 'Register Failed' })
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() params: CreateAccountRequest, @Req() req: Request) {
        return this.authService.register(params);
    }
}
