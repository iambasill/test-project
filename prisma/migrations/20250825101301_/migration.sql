/*
  Warnings:

  - Made the column `admin_id` on table `Active_admin_sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Active_admin_sessions` DROP FOREIGN KEY `Active_admin_sessions_admin_id_fkey`;

-- AlterTable
ALTER TABLE `Active_admin_sessions` MODIFY `admin_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Active_admin_sessions` ADD CONSTRAINT `Active_admin_sessions_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
