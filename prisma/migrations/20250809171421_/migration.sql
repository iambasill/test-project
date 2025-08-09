/*
  Warnings:

  - You are about to drop the column `backView` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `frontView` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `leftView` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `rightView` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `documents` DROP COLUMN `backView`,
    DROP COLUMN `frontView`,
    DROP COLUMN `leftView`,
    DROP COLUMN `rightView`,
    DROP COLUMN `type`;
