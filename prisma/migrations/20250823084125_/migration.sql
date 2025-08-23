/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Active_admin_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Active_admin_sessions` DROP COLUMN `expires_at`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;
