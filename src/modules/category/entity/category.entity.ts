import { BookEntity } from '@/modules/book/entity/book.entity';
import { Expose } from 'class-transformer';

export class CategoryEntity {
  @Expose()
  id: string | null;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}

export class CategoryDetailEntity extends CategoryEntity {
  @Expose()
  books: BookEntity;
}
