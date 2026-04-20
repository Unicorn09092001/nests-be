import { Expose, Type } from 'class-transformer';
import { EBookStatus } from '../dto/filter-book.dto';
import { CategoryEntity } from '@/modules/category/entity/category.entity';
import { UserEntity } from '@/modules/users/entity/user.entity';

export class BookEntity {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  pageNumber: number;

  @Expose()
  status: EBookStatus;
}

export class BorrowRecordEntity {
    @Expose()
    id: string

    @Expose()
    borrowDate: Date

    @Expose()
    dueDate: Date

    @Expose()
    @Type(() => BookEntity)
    books: BookEntity[];

    @Expose()
    @Type(() => UserEntity)
    user: UserEntity
}

export class BookDetailEntity extends BookEntity{
    @Expose()
    category: CategoryEntity
}

