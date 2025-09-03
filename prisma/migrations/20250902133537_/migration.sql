/*
  Warnings:

  - You are about to drop the column `equipmentChasisNumber` on the `equipment_ownerships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[equipmentId,operatorId,isCurrent]` on the table `equipment_ownerships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equipmentId` to the `equipment_ownerships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `equipment_ownerships` DROP FOREIGN KEY `equipment_ownerships_equipmentChasisNumber_fkey`;

-- DropIndex
DROP INDEX `equipment_ownerships_equipmentChasisNumber_operatorId_isCurr_key` ON `equipment_ownerships`;

-- AlterTable
ALTER TABLE `equipment_ownerships` DROP COLUMN `equipmentChasisNumber`,
    ADD COLUMN `equipmentId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `equipment_ownerships_equipmentId_operatorId_isCurrent_key` ON `equipment_ownerships`(`equipmentId`, `operatorId`, `isCurrent`);

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
