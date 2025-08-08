/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(7))` to `Enum(EnumId(0))`.
  - The values [INACTIVE] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `disposal_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment_transfers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inspection_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maintenance_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warranty_info` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serviceNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `disposal_records` DROP FOREIGN KEY `disposal_records_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `equipment_approvedById_fkey`;

-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `equipment_authorizedById_fkey`;

-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `equipment_registeredById_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_access` DROP FOREIGN KEY `equipment_access_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_access` DROP FOREIGN KEY `equipment_access_userId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_assignments` DROP FOREIGN KEY `equipment_assignments_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_assignments` DROP FOREIGN KEY `equipment_assignments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_documents` DROP FOREIGN KEY `equipment_documents_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_transfers` DROP FOREIGN KEY `equipment_transfers_approvedById_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_transfers` DROP FOREIGN KEY `equipment_transfers_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipment_transfers` DROP FOREIGN KEY `equipment_transfers_initiatedById_fkey`;

-- DropForeignKey
ALTER TABLE `inspection_records` DROP FOREIGN KEY `inspection_records_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `inspection_records` DROP FOREIGN KEY `inspection_records_inspectorId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenance_records` DROP FOREIGN KEY `maintenance_records_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `maintenance_records` DROP FOREIGN KEY `maintenance_records_technicianId_fkey`;

-- DropForeignKey
ALTER TABLE `warranty_info` DROP FOREIGN KEY `warranty_info_equipmentId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `password`,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'INSPECTOR', 'OPERATOR', 'VIEWER') NULL,
    MODIFY `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `disposal_records`;

-- DropTable
DROP TABLE `equipment`;

-- DropTable
DROP TABLE `equipment_access`;

-- DropTable
DROP TABLE `equipment_assignments`;

-- DropTable
DROP TABLE `equipment_documents`;

-- DropTable
DROP TABLE `equipment_transfers`;

-- DropTable
DROP TABLE `inspection_records`;

-- DropTable
DROP TABLE `maintenance_records`;

-- DropTable
DROP TABLE `warranty_info`;

-- CreateTable
CREATE TABLE `equipments` (
    `id` VARCHAR(191) NOT NULL,
    `chasisNumber` VARCHAR(191) NOT NULL,
    `equipmentName` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `equipmentType` VARCHAR(191) NOT NULL,
    `equipmentCategory` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `modelNumber` VARCHAR(191) NULL,
    `yearOfManufacture` INTEGER NOT NULL,
    `countryOfOrigin` VARCHAR(191) NOT NULL,
    `dateOfAcquisition` DATETIME(3) NOT NULL,
    `acquisitionMethod` ENUM('PURCHASE', 'LEASE', 'DONATION', 'TRANSFER', 'OTHER') NOT NULL,
    `supplierInfo` VARCHAR(191) NULL,
    `purchaseOrderNumber` VARCHAR(191) NULL,
    `contractReference` VARCHAR(191) NULL,
    `costValue` DECIMAL(15, 2) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN',
    `fundingSource` VARCHAR(191) NULL,
    `weight` DECIMAL(10, 2) NULL,
    `dimensions` VARCHAR(191) NULL,
    `powerRequirements` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `maximumRange` VARCHAR(191) NULL,
    `operationalSpecs` TEXT NULL,
    `requiredCertifications` TEXT NULL,
    `environmentalConditions` TEXT NULL,
    `currentCondition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL DEFAULT 'EXCELLENT',
    `lastConditionCheck` DATETIME(3) NULL,

    UNIQUE INDEX `equipments_chasisNumber_key`(`chasisNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operators` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `serviceNumber` VARCHAR(191) NULL,
    `rank` VARCHAR(191) NULL,
    `branch` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `identificationType` VARCHAR(191) NULL,
    `identificationId` VARCHAR(191) NULL,
    `officialEmailAddress` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `alternatePhoneNumbers` JSON NULL,
    `equipmentId` VARCHAR(191) NULL,

    UNIQUE INDEX `operators_email_key`(`email`),
    UNIQUE INDEX `operators_serviceNumber_key`(`serviceNumber`),
    UNIQUE INDEX `operators_identificationId_key`(`identificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_ownerships` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `primaryDuties` VARCHAR(191) NULL,
    `driverLicenseId` VARCHAR(191) NULL,
    `coFirstName` VARCHAR(191) NULL,
    `coLastName` VARCHAR(191) NULL,
    `coEmail` VARCHAR(191) NULL,
    `coPhoneNumber` VARCHAR(191) NULL,
    `conditionAtAssignment` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL DEFAULT 'EXCELLENT',
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `equipment_ownerships_equipmentId_operatorId_isCurrent_key`(`equipmentId`, `operatorId`, `isCurrent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_conditions` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `recordedById` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspections` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `inspectorId` VARCHAR(191) NULL,
    `datePerformed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextDueDate` DATETIME(3) NULL,
    `overallNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exterior_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interior_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mechanical_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `functional_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_legal_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED', 'NOT_APPLICABLE') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `fileName` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `equipmentId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,
    `ownershipId` VARCHAR(191) NULL,
    `conditionId` VARCHAR(191) NULL,
    `exteriorInspectionId` VARCHAR(191) NULL,
    `interiorInspectionId` VARCHAR(191) NULL,
    `mechanicalInspectionId` VARCHAR(191) NULL,
    `functionalInspectionId` VARCHAR(191) NULL,
    `documentLegalInspectionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_serviceNumber_key` ON `users`(`serviceNumber`);

-- AddForeignKey
ALTER TABLE `operators` ADD CONSTRAINT `operators_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_conditions` ADD CONSTRAINT `equipment_conditions_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_conditions` ADD CONSTRAINT `equipment_conditions_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exterior_inspections` ADD CONSTRAINT `exterior_inspections_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interior_inspections` ADD CONSTRAINT `interior_inspections_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mechanical_inspections` ADD CONSTRAINT `mechanical_inspections_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `functional_inspections` ADD CONSTRAINT `functional_inspections_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_legal_inspections` ADD CONSTRAINT `document_legal_inspections_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ownershipId_fkey` FOREIGN KEY (`ownershipId`) REFERENCES `equipment_ownerships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_conditionId_fkey` FOREIGN KEY (`conditionId`) REFERENCES `equipment_conditions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_exteriorInspectionId_fkey` FOREIGN KEY (`exteriorInspectionId`) REFERENCES `exterior_inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_interiorInspectionId_fkey` FOREIGN KEY (`interiorInspectionId`) REFERENCES `interior_inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_mechanicalInspectionId_fkey` FOREIGN KEY (`mechanicalInspectionId`) REFERENCES `mechanical_inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_functionalInspectionId_fkey` FOREIGN KEY (`functionalInspectionId`) REFERENCES `functional_inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_documentLegalInspectionId_fkey` FOREIGN KEY (`documentLegalInspectionId`) REFERENCES `document_legal_inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
