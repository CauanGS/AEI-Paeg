/*
  Warnings:

  - You are about to drop the `ventures` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `projects` ADD COLUMN `tags` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ventures`;
