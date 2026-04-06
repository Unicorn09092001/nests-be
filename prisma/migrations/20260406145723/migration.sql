-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_createdById_fkey`;

-- DropIndex
DROP INDEX `Room_createdById_key` ON `Room`;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
