/*
  Warnings:

  - The primary key for the `Active_admin_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Active_admin_sessions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `admin_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);
