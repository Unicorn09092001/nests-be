import { Expose } from 'class-transformer';
import { BookEntity } from '@/modules/book/entity/book.entity';

export class AuthorEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  books: BookEntity;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
