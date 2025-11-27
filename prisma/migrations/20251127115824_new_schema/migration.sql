/*
  Warnings:

  - You are about to drop the column `equipmentMake` on the `equipments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vehicleRegistrationNumber]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineNumber]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `equipment_ownerships` DROP FOREIGN KEY `equipment_ownerships_assignedBy_fkey`;

-- AlterTable
ALTER TABLE `equipments` DROP COLUMN `equipmentMake`,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `dateAcquired` VARCHAR(191) NULL,
    ADD COLUMN `engineNumber` VARCHAR(191) NULL,
    ADD COLUMN `equipmentCategory` VARCHAR(191) NULL,
    ADD COLUMN `furnitureType` VARCHAR(191) NULL,
    ADD COLUMN `itemName` VARCHAR(191) NULL,
    ADD COLUMN `materialType` VARCHAR(191) NULL,
    ADD COLUMN `noOfBathrooms` VARCHAR(191) NULL,
    ADD COLUMN `noOfRooms` VARCHAR(191) NULL,
    ADD COLUMN `propertyAddress` VARCHAR(191) NULL,
    ADD COLUMN `propertySize` VARCHAR(191) NULL,
    ADD COLUMN `propertyType` VARCHAR(191) NULL,
    ADD COLUMN `serialNumber` VARCHAR(191) NULL,
    ADD COLUMN `vehicleMake` VARCHAR(191) NULL,
    ADD COLUMN `vehicleRegistrationNumber` VARCHAR(191) NULL,
    ADD COLUMN `vehicleType` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `equipment_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipment_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `equipments_vehicleRegistrationNumber_key` ON `equipments`(`vehicleRegistrationNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `equipments_engineNumber_key` ON `equipments`(`engineNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `equipments_serialNumber_key` ON `equipments`(`serialNumber`);

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_assignedByID_fkey` FOREIGN KEY (`assignedByID`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
