/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `equipments_id_key` ON `equipments`(`id`);
