import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        authors: true,
      },
    });
  }

  async findAll(filterData: FilterBookDto) {
    const { keyword, authorIds, page, createdAt, updatedAt, pageSize } =
      filterData;
    const filter = {
      ...(keyword && {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            isbn: {
              contains: keyword,
            },
          },
        ],
      }),
      ...(authorIds.length && {
        authors: {
          some: {
            id: {
              in: authorIds,
            },
          },
        },
      }),
    };

    return Promise.all([
      this.prisma.book.findMany({
        where: filter,
        include: {
            authors: true,
        },
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({
        where: filter,
      }),
    ]);
  }

  async create(createBookDto: CreateBookDto) {
    const { authorIds, ...data } = createBookDto;

    return this.prisma.book.create({
      data: {
        ...data,
        categoryId: data.categoryId ?? undefined,
        status: 'AVAILABLE',
        authors: {
          connect: authorIds.map((authorId) => ({ id: authorId })),
        },
      },
    });
  }

  async update(updateBookDto: UpdateBookDto) {
    const { id, authorIds, ...data } = updateBookDto;

    return this.prisma.book.update({
      where: { id: updateBookDto.id },
      data: {
        ...data,
        authors: {
          set: authorIds?.map((authorId) => ({ id: authorId })),
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.book.delete({
      where: { id },
    });
  }

  async borrow(borrowBookDto: BorrowBookDto) {
    return this.prisma.borrowRecord.create({
        data: borrowBookDto
    })
  }

  async borrowHistory() {
    const filter = {

    }

    return Promise.all([
        this.prisma.borrowRecord.findMany({
            where: filter
        }),
        this.prisma.borrowRecord.count({
            where: filter
        })
    ])
  }
}
