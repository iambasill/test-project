/*
  Warnings:

  - You are about to drop the column `vehicleMake` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `equipments` table. All the data in the column will be lost.
  - Made the column `endDate` on table `equipment_ownerships` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `equipment_ownerships` MODIFY `endDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `equipments` DROP COLUMN `vehicleMake`,
    DROP COLUMN `vehicleType`,
    ADD COLUMN `equipmentMake` VARCHAR(191) NULL,
    ADD COLUMN `equipmentType` VARCHAR(191) NULL;
