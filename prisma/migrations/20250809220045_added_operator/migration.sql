/*
  Warnings:

  - You are about to drop the column `alternatePhoneNumbers` on the `operators` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `operators` DROP COLUMN `alternatePhoneNumbers`,
    ADD COLUMN `alternatePhoneNumber1` VARCHAR(191) NULL,
    ADD COLUMN `alternatePhoneNumber2` VARCHAR(191) NULL,
    ADD COLUMN `alternatePhoneNumber3` VARCHAR(191) NULL;
