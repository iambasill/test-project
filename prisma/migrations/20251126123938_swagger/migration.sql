/*
  Warnings:

  - You are about to drop the column `userId` on the `equipment_ownerships` table. All the data in the column will be lost.
  - Added the required column `assignedBy` to the `equipment_ownerships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `equipment_ownerships` DROP FOREIGN KEY `equipment_ownerships_userId_fkey`;

-- DropIndex
DROP INDEX `equipment_ownerships_userId_fkey` ON `equipment_ownerships`;

-- AlterTable
ALTER TABLE `equipment_ownerships` DROP COLUMN `userId`,
    ADD COLUMN `assignedBy` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_assignedBy_fkey` FOREIGN KEY (`assignedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
