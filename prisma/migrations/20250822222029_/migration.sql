/*
  Warnings:

  - You are about to drop the column `expires_at` on the `user_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_sessions` DROP COLUMN `expires_at`;
