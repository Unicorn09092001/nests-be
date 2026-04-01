/*
  Warnings:

  - Added the required column `codeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `codeId` VARCHAR(191) NOT NULL;
