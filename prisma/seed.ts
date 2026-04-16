import { EBookStatus, EPermission, PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || '';
const adapter = new PrismaMariaDb(dbUrl);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});


async function findOrCreateCategory(name: string) {
  const existing = await prisma.category.findFirst({
    where: { name },
  });
  if (existing) return existing;

  return prisma.category.create({
    data: { name },
  });
}

async function findOrCreateAuthor(name: string, description: string) {
  const existing = await prisma.author.findFirst({
    where: { name },
  });
  if (existing) return existing;

  return prisma.author.create({
    data: {
      name,
      description,
    },
  });
}

async function main() {
  try {
    // for (const permission of Object.values(EPermission)) {
    //   await prisma.permission.upsert({
    //     where: { name: permission },
    //     update: {},
    //     create: { code: permission },
    //   });
    // }

    const categoryNames = [
      'Fantasy',
      'Science Fiction',
      'History',
      'Philosophy',
    ];

    const categories = await Promise.all(
      categoryNames.map(async (name) => findOrCreateCategory(name)),
    );

    const authorsData = [
      {
        name: 'Isaac Asimov',
        description: 'Author of science fiction, known for the Foundation series and Robot stories.',
      },
      {
        name: 'J.R.R. Tolkien',
        description: 'Fantasy author best known for The Lord of the Rings and The Hobbit.',
      },
      {
        name: 'Yuval Noah Harari',
        description: 'Historian and philosopher, author of Sapiens and Homo Deus.',
      },
      {
        name: 'Mary Shelley',
        description: 'Pioneering science fiction author of Frankenstein.',
      },
    ];

    const authors = await Promise.all(
      authorsData.map(async ({ name, description }) =>
        findOrCreateAuthor(name, description),
      ),
    );

    type BookSeed = {
      title: string;
      isbn: string;
      pageNumber: number;
      status: EBookStatus;
      categoryName: string;
      authorNames: string[];
    };

    const bookData: BookSeed[] = [
      {
        title: 'Foundation',
        isbn: '9780553293357',
        pageNumber: 255,
        status: 'AVAILABLE',
        categoryName: 'Science Fiction',
        authorNames: ['Isaac Asimov'],
      },
      {
        title: 'The Hobbit',
        isbn: '9780547928227',
        pageNumber: 310,
        status: 'AVAILABLE',
        categoryName: 'Fantasy',
        authorNames: ['J.R.R. Tolkien'],
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        isbn: '9780062316110',
        pageNumber: 498,
        status: 'AVAILABLE',
        categoryName: 'History',
        authorNames: ['Yuval Noah Harari'],
      },
      {
        title: 'Frankenstein',
        isbn: '9780143131847',
        pageNumber: 280,
        status: 'AVAILABLE',
        categoryName: 'Science Fiction',
        authorNames: ['Mary Shelley'],
      },
      {
        title: 'The Lord of the Rings',
        isbn: '9780618640157',
        pageNumber: 1178,
        status: 'AVAILABLE',
        categoryName: 'Fantasy',
        authorNames: ['J.R.R. Tolkien'],
      },
    ];

    for (const book of bookData) {
      const category = categories.find((item) => item.name === book.categoryName);
      if (!category) {
        throw new Error(`Missing category ${book.categoryName}`);
      }

      const authorConnect = book.authorNames.map((authorName) => {
        const author = authors.find((item) => item.name === authorName);
        if (!author) {
          throw new Error(`Missing author ${authorName}`);
        }
        return { id: author.id };
      });

      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {},
        create: {
          title: book.title,
          pageNumber: book.pageNumber,
          isbn: book.isbn,
          status: book.status,
          category: {
            connect: { id: category.id },
          },
          authors: {
            connect: authorConnect,
          },
        },
      });
    }

    console.log('Seed completed: permissions, categories, authors, books');
  } finally {
    await prisma.$disconnect();
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
