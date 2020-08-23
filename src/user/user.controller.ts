import {
    Body,
    Controller,
    Get, HttpCode, HttpStatus,
    Param, Patch, Put,
    UseGuards,
    Post
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from './dto/output.dto';
import { CurrentAuth } from '../auth/auth.user.decorator';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiResponse,
} from '@nestjs/swagger';
import { HttpErrors } from '../shared/http-exception-custom';

@ApiTags('users')
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @ApiOperation({ description: 'Get profile of current user' })
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, description: 'Profile found', type: UserProfile })
    @ApiResponse({ status: HttpErrors.USER_NOT_FOUND, description: 'User not found' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' })
    @UseGuards(AuthGuard())
    @Get('me')
    async me(@CurrentAuth('user') user: UserProfile) {
        // return user;
        return this.userService.profileDto(await this.userService.oneOrNotFound(user.id));
    }
}
