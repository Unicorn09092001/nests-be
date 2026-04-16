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
        (request: Request) => request.cookies?.refreshToken || request.body?.refreshToken,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') ?? '',
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: {userId: string, email: string}) {
    return {
      id: payload.userId, 
      email: payload.email,
      refreshToken: request.cookies?.refreshToken || request.body?.refreshToken,
    };
  }
}