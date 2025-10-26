/*
  Warnings:

  - You are about to drop the column `conditionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `documentLegalInspectionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `exteriorInspectionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `functionalInspectionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `interiorInspectionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `mechanicalInspectionId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `documents` table. All the data in the column will be lost.
  - You are about to alter the column `overallCondition` on the `inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to drop the `document_legal_inspections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exterior_inspections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `functional_inspections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interior_inspections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mechanical_inspections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileUrl` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileName` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `document_legal_inspections` DROP FOREIGN KEY `document_legal_inspections_inspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_conditionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_documentLegalInspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_exteriorInspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_functionalInspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_interiorInspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_mechanicalInspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `exterior_inspections` DROP FOREIGN KEY `exterior_inspections_inspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `functional_inspections` DROP FOREIGN KEY `functional_inspections_inspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `interior_inspections` DROP FOREIGN KEY `interior_inspections_inspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `mechanical_inspections` DROP FOREIGN KEY `mechanical_inspections_inspectionId_fkey`;

-- DropIndex
DROP INDEX `documents_conditionId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `documents_documentLegalInspectionId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `documents_exteriorInspectionId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `documents_functionalInspectionId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `documents_interiorInspectionId_fkey` ON `documents`;

-- DropIndex
DROP INDEX `documents_mechanicalInspectionId_fkey` ON `documents`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `conditionId`,
    DROP COLUMN `description`,
    DROP COLUMN `documentLegalInspectionId`,
    DROP COLUMN `exteriorInspectionId`,
    DROP COLUMN `functionalInspectionId`,
    DROP COLUMN `interiorInspectionId`,
    DROP COLUMN `mechanicalInspectionId`,
    DROP COLUMN `metadata`,
    DROP COLUMN `mimeType`,
    DROP COLUMN `url`,
    ADD COLUMN `conditionRecordId` VARCHAR(191) NULL,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `inspectionItemId` VARCHAR(191) NULL,
    MODIFY `fileName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inspections` MODIFY `overallCondition` ENUM('S', 'O', 'A', 'B', 'C') NOT NULL DEFAULT 'S';

-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `document_legal_inspections`;

-- DropTable
DROP TABLE `exterior_inspections`;

-- DropTable
DROP TABLE `functional_inspections`;

-- DropTable
DROP TABLE `interior_inspections`;

-- DropTable
DROP TABLE `mechanical_inspections`;

-- CreateTable
CREATE TABLE `inspection_items` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `pressure` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `booleanValue` BOOLEAN NULL,
    `unit` VARCHAR(191) NULL,
    `stumpLastDate` DATETIME(3) NULL,
    `oilfilterLastDate` DATETIME(3) NULL,
    `fuelpumpLastDate` DATETIME(3) NULL,
    `airfilterLastDate` DATETIME(3) NULL,
    `HubLastPackedDate` DATETIME(3) NULL,
    `lastDrainDate` DATETIME(3) NULL,
    `odometerReading` VARCHAR(191) NULL,
    `levelOfHydraulicFluid` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inspection_items_inspectionId_category_idx`(`inspectionId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inspection_items` ADD CONSTRAINT `inspection_items_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_conditionRecordId_fkey` FOREIGN KEY (`conditionRecordId`) REFERENCES `equipment_conditions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_inspectionItemId_fkey` FOREIGN KEY (`inspectionItemId`) REFERENCES `inspection_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
