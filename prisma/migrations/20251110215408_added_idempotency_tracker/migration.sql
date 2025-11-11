-- CreateTable
CREATE TABLE `idempotency-tracker` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `equipment_id` VARCHAR(191) NULL,
    `inspection_id` VARCHAR(191) NULL,
    `equipment_ownership_id` VARCHAR(191) NULL,

    INDEX `idempotency-tracker_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_equipment_id_fkey` FOREIGN KEY (`equipment_id`) REFERENCES `equipments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_equipment_ownership_id_fkey` FOREIGN KEY (`equipment_ownership_id`) REFERENCES `equipment_ownerships`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
