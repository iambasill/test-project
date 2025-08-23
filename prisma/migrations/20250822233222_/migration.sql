/*
  Warnings:

  - Added the required column `session_token` to the `Active_admin_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Active_admin_sessions` ADD COLUMN `session_token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_sessions` ADD COLUMN `session_token` VARCHAR(191) NOT NULL;
