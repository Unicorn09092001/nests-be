import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST', 'localhost'),
        port: parseInt(configService.get('MYSQL_PORT', '3306')),
        username: configService.get('MYSQL_USERNAME', 'root'),
        password: configService.get('MYSQL_PASSWORD', '123456'),
        database: configService.get('MYSQL_DATABASE', 'restaurant_db'),
        entities: ['dist/**/*.entity.js'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
