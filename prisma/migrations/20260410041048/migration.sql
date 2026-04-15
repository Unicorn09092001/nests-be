/*
  Warnings:

  - The values [CREATE_USER] on the enum `permission_name` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `permission` MODIFY `name` ENUM('CREATE_CATEGORY', 'DELETE_CATEGORY', 'UPDATE_CATEGORY') NOT NULL;

-- CreateTable
CREATE TABLE `author` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `pageNumber` INTEGER NOT NULL,
    `isbn` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `book_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AuthorToBook` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AuthorToBook_AB_unique`(`A`, `B`),
    INDEX `_AuthorToBook_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `profile_userId_idx` ON `profile`(`userId`);

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AuthorToBook` ADD CONSTRAINT `_AuthorToBook_A_fkey` FOREIGN KEY (`A`) REFERENCES `author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AuthorToBook` ADD CONSTRAINT `_AuthorToBook_B_fkey` FOREIGN KEY (`B`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
