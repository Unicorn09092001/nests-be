import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Refresh,
      ]),
      // ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY') ?? '',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: {userId: string}) {
    console.log('payload', payload)

    return this.authService.verifyUserRefreshToken(request.cookies?.Refresh, payload.userId);
  }
}