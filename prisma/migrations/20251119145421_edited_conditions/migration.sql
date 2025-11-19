/*
  Warnings:

  - You are about to alter the column `overallCondition` on the `inspections` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `inspections` MODIFY `overallCondition` ENUM('Serviceable', 'Operatioanl', 'Needs_Maintenance', 'Non_Operational') NOT NULL DEFAULT 'Serviceable';
