import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';

@Module({
  imports: [UsersModule],
  controllers: [BookController],
  providers: [BookService, BookRepository, UsersService, UserRepository],
})
export class BookModule {}
