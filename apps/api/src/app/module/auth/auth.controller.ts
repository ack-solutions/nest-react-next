import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginInputDTO } from './dto/login-input.dto';
import { LoginSuccessDTO } from './dto/login-success.dto';
import { LoginSendOtpDTO } from './dto/login-send-otp.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @ApiOperation({ summary: 'Login verify email end OTP' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Send OTP Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Send OTP Success',
    })
    @Post('send-login-otp')
    async sendLoginOtp(@Body() req: LoginSendOtpDTO) {
        return this.authService.sendLoginOtp(req);
    }
    
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Login Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: LoginSuccessDTO,
        description: 'Login Success',
    })
    @Post('login')
    async login(@Body() req: LoginInputDTO) {
        return this.authService.login(req);
    }


    @ApiOperation({ summary: 'Password Change' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Password Change Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Password Change Success',
    })
    @Post('password-change')
    @UseGuards(AuthGuard('jwt'))
    async passwordChange(@Body() req: any) {
        return this.authService.passwordChange(req);
    }

    @ApiOperation({ summary: 'Reset Password' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Reset Password Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Reset Password Success',
    })
    @Post('reset-password')
    async resetPassword(@Body() req: any) {
        console.log('654654156')
        return this.authService.resetPassword(req);
    }

    @ApiOperation({ summary: 'Forgot Password' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Login Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Login Success',
    })
    @Post('forget-password')
    async forgotPassword(@Body() req: any) {
        return this.authService.forgotPassword(req);
    }
}
