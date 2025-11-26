/*
  Warnings:

  - You are about to drop the column `acquisitionMethod` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `contractReference` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `costValue` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfOrigin` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfAcquisition` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `environmentalConditions` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentCategory` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentType` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `fundingSource` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `lastConditionCheck` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `maximumRange` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `operationalSpecs` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `powerRequirements` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseOrderNumber` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `requiredCertifications` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `supplierInfo` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyCoverageDetails` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyEndDate` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyStartDate` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `equipments` table. All the data in the column will be lost.
  - You are about to alter the column `currentCondition` on the `equipments` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(191)`.
  - You are about to drop the column `HubLastPackedDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `airfilterLastDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `booleanValue` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `fuelpumpLastDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `lastDrainDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `levelOfHydraulicFluid` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `odometerReading` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `oilfilterLastDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `pressure` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `stumpLastDate` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `inspection_items` table. All the data in the column will be lost.
  - You are about to drop the column `nextDueDate` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `overallNotes` on the `inspections` table. All the data in the column will be lost.
  - You are about to alter the column `overallCondition` on the `inspections` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the `equipmentCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subCategory` to the `inspection_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `equipment_ownerships` MODIFY `endDate` VARCHAR(191) NULL,
    ALTER COLUMN `conditionAtAssignment` DROP DEFAULT;

-- AlterTable
ALTER TABLE `equipments` DROP COLUMN `acquisitionMethod`,
    DROP COLUMN `contractReference`,
    DROP COLUMN `costValue`,
    DROP COLUMN `countryOfOrigin`,
    DROP COLUMN `currency`,
    DROP COLUMN `dateOfAcquisition`,
    DROP COLUMN `dimensions`,
    DROP COLUMN `environmentalConditions`,
    DROP COLUMN `equipmentCategory`,
    DROP COLUMN `equipmentType`,
    DROP COLUMN `fuelType`,
    DROP COLUMN `fundingSource`,
    DROP COLUMN `lastConditionCheck`,
    DROP COLUMN `manufacturer`,
    DROP COLUMN `maximumRange`,
    DROP COLUMN `modelNumber`,
    DROP COLUMN `operationalSpecs`,
    DROP COLUMN `powerRequirements`,
    DROP COLUMN `purchaseOrderNumber`,
    DROP COLUMN `requiredCertifications`,
    DROP COLUMN `supplierInfo`,
    DROP COLUMN `warrantyCoverageDetails`,
    DROP COLUMN `warrantyEndDate`,
    DROP COLUMN `warrantyStartDate`,
    DROP COLUMN `weight`,
    ADD COLUMN `addedById` VARCHAR(191) NULL,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `registrationNumber` VARCHAR(191) NULL,
    ADD COLUMN `vehicleMake` VARCHAR(191) NULL,
    ADD COLUMN `vehicleType` VARCHAR(191) NULL,
    MODIFY `currentCondition` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inspection_items` DROP COLUMN `HubLastPackedDate`,
    DROP COLUMN `airfilterLastDate`,
    DROP COLUMN `booleanValue`,
    DROP COLUMN `fuelpumpLastDate`,
    DROP COLUMN `itemName`,
    DROP COLUMN `lastDrainDate`,
    DROP COLUMN `levelOfHydraulicFluid`,
    DROP COLUMN `method`,
    DROP COLUMN `odometerReading`,
    DROP COLUMN `oilfilterLastDate`,
    DROP COLUMN `position`,
    DROP COLUMN `pressure`,
    DROP COLUMN `stumpLastDate`,
    DROP COLUMN `unit`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `value`,
    ADD COLUMN `recommendation` TEXT NULL,
    ADD COLUMN `subCategory` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `nextDueDate`,
    DROP COLUMN `overallNotes`,
    ADD COLUMN `generalNotes` TEXT NULL,
    MODIFY `overallCondition` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `equipmentCategory`;

-- CreateTable
CREATE TABLE `InspectionCategory` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InspectionCategory_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SubCategory_categoryId_title_key`(`categoryId`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `equipments_registrationNumber_key` ON `equipments`(`registrationNumber`);

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `InspectionCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipments` ADD CONSTRAINT `equipments_addedById_fkey` FOREIGN KEY (`addedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
