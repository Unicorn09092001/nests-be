/*
  Warnings:

  - Added the required column `codeExpired` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `codeExpired` DATETIME(3) NOT NULL;
