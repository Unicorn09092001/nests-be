
import { comparePassword, hashPasswordHelper } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
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

      if(!user.isEmailVerified) {
        throw new BadRequestException("Tài khoản chua được kích hoạt.")
      }

      const authenticated = await comparePassword(pass, user.password);
      if(authenticated) return null;

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
    const user = await this.usersService.getUserById(userId);

    const payload = { username: email, userId: userId, roles: user?.roles};

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
      id: userId,
      refreshToken: hashRefreshToken
    })
  }

  async login(user: {email: string, id: string | number}, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(expiresAccessToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRED')))

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(expiresRefreshToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')))

    const {accessToken, refreshToken} = await this.generateTokens(String(user.id), user.email);
    
    await this.saveRefreshToken(String(user.id), refreshToken);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
      sameSite: 'none',
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
      sameSite: 'none',
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        email: user.email,
        id: user.id,
        // name: user.name
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
        id: userId,
        refreshToken: ''
      })

      response.clearCookie('Authentication');
      response.clearCookie('refreshToken');
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
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        email: user.email,
        id: user._id,
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
