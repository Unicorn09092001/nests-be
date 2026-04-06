/*
  Warnings:

  - Added the required column `updateAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` ADD COLUMN `updateAt` DATETIME(3) NOT NULL;
