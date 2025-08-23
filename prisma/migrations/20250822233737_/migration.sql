/*
  Warnings:

  - You are about to drop the column `session_token` on the `Active_admin_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Active_admin_sessions` DROP COLUMN `session_token`;
