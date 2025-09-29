-- CreateIndex
CREATE INDEX `equipment_ownerships_createdAt_idx` ON `equipment_ownerships`(`createdAt`);

-- CreateIndex
CREATE INDEX `equipment_ownerships_isCurrent_idx` ON `equipment_ownerships`(`isCurrent`);

-- RenameIndex
ALTER TABLE `equipment_ownerships` RENAME INDEX `equipment_ownerships_equipmentId_fkey` TO `equipment_ownerships_equipmentId_idx`;

-- RenameIndex
ALTER TABLE `equipment_ownerships` RENAME INDEX `equipment_ownerships_operatorId_fkey` TO `equipment_ownerships_operatorId_idx`;
