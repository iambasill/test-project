/*
  Warnings:

  - You are about to alter the column `yearOfManufacture` on the `equipments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `equipments` MODIFY `yearOfManufacture` INTEGER NULL;
