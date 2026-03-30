
import { comparePassword, hashPasswordHelper } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if(!user) return null;

      const authenticated = await comparePassword(pass, user.password);
      if(!authenticated) return null;

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.getUserById(userId);
      if (!user) return null;

      const refreshTokenMatches = await comparePassword(refreshToken, user?.refreshToken ?? "");
      if(!refreshTokenMatches) {
        throw new UnauthorizedException()
      }
        
      return user;
    } catch (error) {
      this.logger.error('Verify user refresh token error', error);
      throw new UnauthorizedException('Refresh token is not valid.')
    }
  } 

  async login(user: {email: string, _id: string, name: string}, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(expiresAccessToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRED')))

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(expiresRefreshToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')))

    const payload = { username: user.email, userId: user._id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRED')
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_MS')
    })

    const hashRefreshToken = await hashPasswordHelper(refreshToken) || ""

    await this.usersService.update({
      _id: user._id,
      name: '',
      phone: '',
      address: '',
      image: '',
      refreshToken: hashRefreshToken
    })

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name
      }
    };
  }

  async signOut(userId: string, response: Response) {
    try {
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.usersService.update({
        _id: userId,
        name: user.name,
        phone: user.phone,
        address: user.address,
        image: '',
        refreshToken: ''
      })

      response.clearCookie('Authentication');
      response.clearCookie('Refresh');
      response.status(200).json({ message: 'Successfully signed out' });
    } catch (error) {
      this.logger.error('Sign out error:', {
        error: error.message,
        userId,
        stack: error.stack,
      });
      throw new UnauthorizedException('Failed to process sign out');
    }
  }

  // async refreshToken(user: any) {
  //   const userId = user._id.toHexString ? user._id.toHexString() : user._id;
  //   const payload = { username: user.email, userId: userId };

  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: this.configService.getOrThrow<string>('JWT_SECRET_KEY'),
  //     expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRED')
  //   })

  //   return {
  //     access_token: accessToken,
  //     user: {
  //       email: user.email,
  //       _id: user._id,
  //       name: user.name
  //     }
  //   };
  // }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async handleResendVerifyCode(userId: string) {
    return await this.usersService.handleResendVerifyCode(userId);
  }
}
