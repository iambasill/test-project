/*
  Warnings:

  - You are about to drop the column `equipmentChasisNumber` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_equipmentChasisNumber_fkey`;

-- DropIndex
DROP INDEX `documents_equipmentChasisNumber_fkey` ON `documents`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `equipmentChasisNumber`,
    ADD COLUMN `equipmentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
