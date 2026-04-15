import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorRepository } from './author.repository';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
})
export class AuthorModule {}
