import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLogin(@Request() req, @Res({ passthrough: true }) response: express.Response) {
    return this.authService.login(req.user, response)
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

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refresh(@Request() req, @Res({ passthrough: true }) response: express.Response) {
    console.log('refresh token', req.user)

    return this.authService.login(req.user, response);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(
    @Request() req,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    await this.authService.signOut(req.user._id, response);
  }
}
