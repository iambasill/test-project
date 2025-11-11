/*
  Warnings:

  - You are about to drop the column `itemType` on the `inspection_items` table. All the data in the column will be lost.
  - Added the required column `method` to the `inspection_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `equipmentCategory` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `inspection_items` DROP COLUMN `itemType`,
    ADD COLUMN `method` VARCHAR(191) NOT NULL;
