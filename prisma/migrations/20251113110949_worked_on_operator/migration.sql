-- AlterTable
ALTER TABLE `idempotency-tracker` ADD COLUMN `operator_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
