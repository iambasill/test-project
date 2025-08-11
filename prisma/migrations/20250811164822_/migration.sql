/*
  Warnings:

  - The values [OPERATOR,COMMANDER] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `equipments` MODIFY `yearOfManufacture` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('SYSADMIN', 'ADMIN', 'MANAGER', 'AUDITOR', 'OFFICER') NULL;
