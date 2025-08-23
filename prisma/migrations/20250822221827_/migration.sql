/*
  Warnings:

  - You are about to drop the column `token` on the `user_sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `user_sessions_token_key` ON `user_sessions`;

-- AlterTable
ALTER TABLE `user_sessions` DROP COLUMN `token`;
