/*
  Warnings:

  - You are about to drop the column `equipmentChasisNumber` on the `inspections` table. All the data in the column will be lost.
  - Added the required column `equipmentId` to the `inspections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `inspections` DROP FOREIGN KEY `inspections_equipmentChasisNumber_fkey`;

-- DropIndex
DROP INDEX `inspections_equipmentChasisNumber_fkey` ON `inspections`;

-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `equipmentChasisNumber`,
    ADD COLUMN `equipmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
