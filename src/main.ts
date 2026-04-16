import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.setGlobalPrefix('api/v1', {exclude: ['']});

  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector), {
    excludeExtraneousValues: true, // Chỉ trả về những gì có @Expose
    // strategy: 'excludeAll',        // Cực kỳ nghiêm ngặt: Mặc định là ẩn hết
  }),
);

  await app.listen(port);
}
bootstrap();