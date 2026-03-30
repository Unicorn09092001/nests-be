import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      // imports: [ConfigModule], // 1. Import ConfigModule
      useFactory: async (configService: ConfigService) => ({ // 2. Define an async factory
        global: true,
        secret: configService.get<string>('JWT_SECRET_KEY'), // 3. Use ConfigService to get values
        signOptions: {
          expiresIn: configService.get<number>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService], // 4. Inject the ConfigService into the factory
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule {}
