-- CreateTable
CREATE TABLE `equipmentCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `serviceNumber` VARCHAR(191) NULL,
    `rank` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `role` ENUM('PLATADMIN', 'ADMIN', 'MANAGER', 'AUDITOR', 'OFFICER') NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NULL DEFAULT 'PENDING',
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `refreshToken` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `loginAttempt` INTEGER NULL DEFAULT 0,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_serviceNumber_key`(`serviceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipments` (
    `id` VARCHAR(191) NOT NULL,
    `chasisNumber` VARCHAR(191) NULL,
    `equipmentName` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `equipmentType` VARCHAR(191) NULL,
    `equipmentCategory` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NULL,
    `modelNumber` VARCHAR(191) NULL,
    `yearOfManufacture` VARCHAR(191) NULL,
    `countryOfOrigin` VARCHAR(191) NULL,
    `dateOfAcquisition` VARCHAR(191) NULL,
    `acquisitionMethod` VARCHAR(191) NULL,
    `supplierInfo` VARCHAR(191) NULL,
    `purchaseOrderNumber` VARCHAR(191) NULL,
    `contractReference` VARCHAR(191) NULL,
    `costValue` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL DEFAULT 'NGN',
    `fundingSource` VARCHAR(191) NULL,
    `warrantyStartDate` VARCHAR(191) NULL,
    `warrantyEndDate` VARCHAR(191) NULL,
    `warrantyCoverageDetails` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `dimensions` VARCHAR(191) NULL,
    `powerRequirements` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `maximumRange` VARCHAR(191) NULL,
    `operationalSpecs` TEXT NULL,
    `requiredCertifications` TEXT NULL,
    `environmentalConditions` TEXT NULL,
    `currentCondition` ENUM('S', 'O', 'A', 'B', 'C') NOT NULL,
    `lastConditionCheck` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipments_id_key`(`id`),
    UNIQUE INDEX `equipments_chasisNumber_key`(`chasisNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operators` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `serviceNumber` VARCHAR(191) NOT NULL,
    `rank` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `identificationType` VARCHAR(191) NULL,
    `identificationId` VARCHAR(191) NULL,
    `officialEmailAddress` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `alternatePhoneNumber1` VARCHAR(191) NULL,
    `alternatePhoneNumber2` VARCHAR(191) NULL,
    `alternatePhoneNumber3` VARCHAR(191) NULL,
    `equipmentChasisNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `operators_email_key`(`email`),
    UNIQUE INDEX `operators_serviceNumber_key`(`serviceNumber`),
    UNIQUE INDEX `operators_identificationId_key`(`identificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_ownerships` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `primaryDuties` VARCHAR(191) NULL,
    `driverLicenseId` VARCHAR(191) NULL,
    `coFirstName` VARCHAR(191) NULL,
    `coLastName` VARCHAR(191) NULL,
    `coEmail` VARCHAR(191) NULL,
    `coPhoneNumber` VARCHAR(191) NULL,
    `conditionAtAssignment` VARCHAR(191) NULL DEFAULT '',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `equipment_ownerships_equipmentId_idx`(`equipmentId`),
    INDEX `equipment_ownerships_operatorId_idx`(`operatorId`),
    INDEX `equipment_ownerships_createdAt_idx`(`createdAt`),
    INDEX `equipment_ownerships_isCurrent_idx`(`isCurrent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_conditions` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentChasisNumber` VARCHAR(191) NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `recordedById` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspections` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `inspectorId` VARCHAR(191) NULL,
    `datePerformed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextDueDate` DATETIME(3) NULL,
    `overallNotes` TEXT NULL,
    `overallCondition` ENUM('S', 'O', 'A', 'B', 'C') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_items` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `pressure` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `booleanValue` BOOLEAN NULL,
    `unit` VARCHAR(191) NULL,
    `stumpLastDate` DATETIME(3) NULL,
    `oilfilterLastDate` DATETIME(3) NULL,
    `fuelpumpLastDate` DATETIME(3) NULL,
    `airfilterLastDate` DATETIME(3) NULL,
    `HubLastPackedDate` DATETIME(3) NULL,
    `lastDrainDate` DATETIME(3) NULL,
    `odometerReading` VARCHAR(191) NULL,
    `levelOfHydraulicFluid` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inspection_items_inspectionId_category_idx`(`inspectionId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,
    `ownershipId` VARCHAR(191) NULL,
    `conditionRecordId` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,
    `inspectionItemId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Active_admin_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,
    `login_time` DATETIME(3) NOT NULL,
    `logout_time` DATETIME(3) NULL,

    UNIQUE INDEX `Active_admin_sessions_admin_id_key`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NOT NULL DEFAULT '',
    `login_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logout_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `idempotency-tracker` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `equipment_id` VARCHAR(191) NULL,
    `inspection_id` VARCHAR(191) NULL,
    `equipment_ownership_id` VARCHAR(191) NULL,
    `operator_id` VARCHAR(191) NULL,

    INDEX `idempotency-tracker_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `operators` ADD CONSTRAINT `operators_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_ownerships` ADD CONSTRAINT `equipment_ownerships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_conditions` ADD CONSTRAINT `equipment_conditions_equipmentChasisNumber_fkey` FOREIGN KEY (`equipmentChasisNumber`) REFERENCES `equipments`(`chasisNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_conditions` ADD CONSTRAINT `equipment_conditions_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_items` ADD CONSTRAINT `inspection_items_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ownershipId_fkey` FOREIGN KEY (`ownershipId`) REFERENCES `equipment_ownerships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_conditionRecordId_fkey` FOREIGN KEY (`conditionRecordId`) REFERENCES `equipment_conditions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_inspectionItemId_fkey` FOREIGN KEY (`inspectionItemId`) REFERENCES `inspection_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Active_admin_sessions` ADD CONSTRAINT `Active_admin_sessions_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_equipment_id_fkey` FOREIGN KEY (`equipment_id`) REFERENCES `equipments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_operator_id_fkey` FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `idempotency-tracker` ADD CONSTRAINT `idempotency-tracker_equipment_ownership_id_fkey` FOREIGN KEY (`equipment_ownership_id`) REFERENCES `equipment_ownerships`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
