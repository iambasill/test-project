/*
  Warnings:

  - You are about to drop the column `session_token` on the `Active_admin_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Active_admin_sessions` DROP COLUMN `session_token`,
    ADD COLUMN `expires_at` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `logout_time` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `login_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logout_time` DATETIME(3) NULL,

    UNIQUE INDEX `user_sessions_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Active_admin_sessions` ADD CONSTRAINT `Active_admin_sessions_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
