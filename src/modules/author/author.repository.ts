import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.author.findUnique({
      where: {id},
      include: {
        books: true
      }
    })
  }

  async findAll(filterData: FilterAuthorDto) {
    const { name, bookIds, page, createdAt, updatedAt, pageSize } = filterData;
    const filter = {
      ...(name && {
        OR: [
          {
            name: {
              contains: name,
            }
          }
        ]
      }),
      ...(bookIds.length && {
        books: {
          some: {
            id: {
              in: bookIds,
            },
          },
        },
      }),
      createdAt,
      updatedAt,
    };

    return Promise.all([
      this.prisma.author.findMany({
        where: filter,
        include: {
          books: true
        },
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.author.count({
        where: filter,
      }),
    ]);
  }

  async create(createAuthorDto: CreateAuthorDto) {
    const { bookIds, ...data } = createAuthorDto;

    return this.prisma.author.create({
      data: {
        ...data,
        books: {
          connect: bookIds.map((bookId) => ({ id: bookId })),
        },
      },
    });
  }

    async update(updateAuthorDto: UpdateAuthorDto) {
      return this.prisma.author.update({
          where: {id: updateAuthorDto.id},
          data: {
              name: updateAuthorDto.name,
              description: updateAuthorDto.description,
              books: {
                set: updateAuthorDto.bookIds?.map(bookId => ({id: bookId}))
              }
          }
      })
    }

  async delete(id: string) {
    return this.prisma.author.delete({
        where: {id}
    })
  }
}
