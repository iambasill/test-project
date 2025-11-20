/*
  Warnings:

  - The values [Operatioanl] on the enum `inspections_overallCondition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `equipments` MODIFY `equipmentName` VARCHAR(191) NULL,
    MODIFY `model` VARCHAR(191) NULL,
    MODIFY `equipmentType` VARCHAR(191) NULL,
    MODIFY `manufacturer` VARCHAR(191) NULL,
    MODIFY `countryOfOrigin` VARCHAR(191) NULL,
    MODIFY `acquisitionMethod` ENUM('PURCHASE', 'LEASE', 'DONATION', 'TRANSFER', 'OTHER') NULL,
    MODIFY `currency` VARCHAR(191) NULL DEFAULT 'NGN';

-- AlterTable
ALTER TABLE `inspections` MODIFY `overallCondition` ENUM('Serviceable', 'Operational', 'Needs_Maintenance', 'Non_Operational') NOT NULL DEFAULT 'Serviceable';
