# MySQL Database Configuration Guide

## Overview
This project is now configured to use MySQL as the primary database. TypeORM is used as the ORM for database management.

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
PORT=3001

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=restaurant_db

# MongoDB (optional, for backward compatibility)
MONGODB_URI=mongodb://root:123456@localhost:27017/admin

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=no-reply@yourapp.com
```

## Setup Instructions

### 1. Start MySQL Container
```bash
# Using Docker Compose
docker-compose up -d mysql

# Or run MySQL locally if you have it installed
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run the Application
```bash
# Development mode with hot reload
pnpm run dev

# Or with debugging
pnpm run start:debug

# Production mode
pnpm run start:prod
```

## Creating Entities

TypeORM entities define the structure of your database tables. Examples are provided in:
- `src/modules/users/entities/user.entity.ts`
- `src/modules/restaurants/entities/restaurant.entity.ts`

### Example Entity Structure:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('table_name')
export class MyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Creating Repositories

To use an entity in your service, you need to inject the repository:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

## Registering Entities in Module

In your module file, register the entities:

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

## TypeORM Migrations (Optional)

For production environments, you may want to use migrations:

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Useful TypeORM Commands

```typescript
// Find all
const users = await usersRepository.find();

// Find by ID
const user = await usersRepository.findOne({ where: { id: 1 } });

// Find with relations
const user = await usersRepository.findOne({
  where: { id: 1 },
  relations: ['posts', 'profile'],
});

// Find with filtering
const activeUsers = await usersRepository.find({
  where: { isEmailVerified: true },
});

// Create and save
const newUser = usersRepository.create({ name: 'John' });
await usersRepository.save(newUser);

// Update
await usersRepository.update({ id: 1 }, { name: 'Jane' });

// Delete
await usersRepository.remove(user);
```

## Database Synchronization

In development mode, TypeORM will automatically synchronize your entities with the database whenever you start the application. You can control this behavior in `src/database/database.module.ts`:

```typescript
synchronize: configService.get('NODE_ENV') !== 'production',
```

**Warning:** Do NOT use `synchronize: true` in production. Use migrations instead.

## Troubleshooting

### Connection Errors
- Ensure MySQL is running: `docker-compose up -d mysql`
- Check `.env` file has correct credentials
- Verify MySQL port is not in use (default: 3306)

### Module Not Found Errors
- Ensure entities path in `database.module.ts` is correct
- All entity files should end with `.entity.ts`

### Query Errors
- Make sure entities are registered in module imports
- Check TypeORM syntax for queries

For more information, visit [TypeORM Documentation](https://typeorm.io/)
