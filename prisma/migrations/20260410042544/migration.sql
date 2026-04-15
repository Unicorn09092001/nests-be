/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `book_categoryId_fkey`;

-- AlterTable
ALTER TABLE `author` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `book` ADD COLUMN `status` ENUM('AVAILABLE', 'BORROWED', 'MAINTENANCE') NOT NULL;

-- DropTable
DROP TABLE `categories`;

-- CreateTable
CREATE TABLE `borrow_record` (
    `id` VARCHAR(191) NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NOT NULL,
    `returnDate` DATETIME(3) NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `borrow_record_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `book_isbn_key` ON `book`(`isbn`);

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow_record` ADD CONSTRAINT `borrow_record_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow_record` ADD CONSTRAINT `borrow_record_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
