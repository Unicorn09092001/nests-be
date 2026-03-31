
import { comparePassword, hashPasswordHelper } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

      if (!user) {
        throw new UnauthorizedException();
      }

      if(user.isActive === false) {
        throw new BadRequestException("Tài khoản chua được kích hoạt.")
      }

      const authenticated = await comparePassword(pass, user.password);
      if(!authenticated) return null;

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string): Promise<any> {
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

  async generateTokens(userId: string, email: string) {
    const payload = { username: email, userId: userId};

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRED'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_MS')
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const hashRefreshToken = await hashPasswordHelper(refreshToken) || ""

    await this.usersService.update({
      _id: userId,
      name: '',
      phone: '',
      address: '',
      image: '',
      refreshToken: hashRefreshToken
    })
  }

  async login(user: {email: string, _id: string, name: string}, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(expiresAccessToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRED')))

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(expiresRefreshToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')))

    const {accessToken, refreshToken} = await this.generateTokens(user._id, user.email);
    
    await this.saveRefreshToken(user._id, refreshToken);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
      sameSite: 'none',
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
      sameSite: 'none',
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

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.verifyUserRefreshToken(refreshToken, userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(userId, user.email);
    await this.saveRefreshToken(userId, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name
      }
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async handleResendVerifyCode(userId: string) {
    return await this.usersService.handleResendVerifyCode(userId);
  }
}
