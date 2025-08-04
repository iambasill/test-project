-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'password',
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'pending';
