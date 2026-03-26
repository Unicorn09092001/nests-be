import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Public()
  @Get('resend-verify-code/:id')
  resendVerifyCode(@Param("id") userId: string) {
    return this.authService.handleResendVerifyCode(userId);
  }
}
