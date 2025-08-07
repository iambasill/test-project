/*
  Warnings:

  - The values [TECHNICIAN,INSPECTOR] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('PLATADMIN', 'ADMIN', 'OFFICER', 'MANAGER', 'OPERATOR', 'COMMANDER') NOT NULL DEFAULT 'OFFICER';
