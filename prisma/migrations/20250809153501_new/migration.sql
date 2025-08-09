/*
  Warnings:

  - You are about to drop the column `equipmentId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `equipment_conditions` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `equipment_ownerships` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `operators` table. All the data in the column will be lost.
  - The values [INSPECTOR,VIEWER] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[equipmentChasisNumber,operatorId,isCurrent]` on the table `equipment_ownerships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equipmentChasisNumber` to the `equipment_conditions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `equipment_conditions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipmentChasisNumber` to the `equipment_ownerships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `equipment_ownerships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipmentChasisNumber` to the `inspections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `operators` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_conditions` DROP FOREIGN KEY `equipment_conditions_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_ownerships` DROP FOREIGN KEY `equipment_ownerships_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `inspections` DROP FOREIGN KEY `inspections_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `operators` DROP FOREIGN KEY `operators_equipmentId_fkey`;

-- DropIndex
DROP INDEX `documents_equipmentId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `equipment_conditions_equipmentId_fkey` ON `equipment_conditions`;

-- DropIndex
DROP INDEX `equipment_ownerships_equipmentId_operatorId_isCurrent_key` ON `equipment_ownerships`;

-- DropIndex
DROP INDEX `inspections_equipmentId_fkey` ON `inspections`;

-- DropIndex
DROP INDEX `operators_equipmentId_fkey` ON `operators`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `equipmentId`,
    ADD COLUMN `equipmentChasisNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `equipment_conditions` DROP COLUMN `equipmentId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `equipmentChasisNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `equipment_ownerships` DROP COLUMN `equipmentId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `equipmentChasisNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `equipmentId`,
    ADD COLUMN `equipmentChasisNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `operators` DROP COLUMN `equipmentId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `equipmentChasisNumber` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'MANAGER', 'OPERATOR', 'OFFICER', 'COMMANDER') NULL;

-- CreateIndex
CREATE UNIQUE INDEX `equipment_ownerships_equipmentChasisNumber_operatorId_isCurr_key` ON `equipment_ownerships`(`equipmentChasisNumber`, `operatorId`, `isCurrent`);

-- AddForeignKey
ALTER TABLE `operators` ADD CONSTRAINT `operators_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_conditions` ADD CONSTRAINT `equipment_conditions_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE SET NULL ON UPDATE CASCADE;
