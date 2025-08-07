/*
  Warnings:

  - The values [AUDITOR] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [VERIFIED,BLOCKED,DELETED] on the enum `users_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `rank` VARCHAR(191) NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'OFFICER', 'TECHNICIAN', 'INSPECTOR', 'COMMANDER') NOT NULL DEFAULT 'OFFICER',
    MODIFY `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `chasisNumber` VARCHAR(191) NOT NULL,
    `equipmentName` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `equipmentType` ENUM('VEHICLE', 'AIRCRAFT', 'NAVAL_VESSEL', 'COMMUNICATION_EQUIPMENT', 'WEAPONS_SYSTEM', 'SUPPORT_EQUIPMENT', 'OTHER') NOT NULL,
    `equipmentCategory` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `modelNumber` VARCHAR(191) NULL,
    `yearOfManufacture` INTEGER NOT NULL,
    `countryOfOrigin` VARCHAR(191) NOT NULL,
    `dateOfAcquisition` DATETIME(3) NOT NULL,
    `acquisitionMethod` ENUM('PURCHASE', 'DONATION', 'GRANT', 'TRANSFER', 'CAPTURED', 'SEIZED', 'LEASE') NOT NULL,
    `supplierInfo` VARCHAR(191) NULL,
    `purchaseOrderNumber` VARCHAR(191) NULL,
    `contractReference` VARCHAR(191) NULL,
    `costValue` DECIMAL(15, 2) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN',
    `fundingSource` VARCHAR(191) NULL,
    `weight` DECIMAL(10, 2) NULL,
    `length` DECIMAL(8, 2) NULL,
    `width` DECIMAL(8, 2) NULL,
    `height` DECIMAL(8, 2) NULL,
    `powerRequirements` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `maximumRange` VARCHAR(191) NULL,
    `operationalSpecs` TEXT NULL,
    `requiredCertifications` TEXT NULL,
    `environmentalConditions` TEXT NULL,
    `currentLocation` VARCHAR(191) NOT NULL,
    `currentBase` VARCHAR(191) NULL,
    `assignedUnit` ENUM('NIGERIAN_ARMY', 'NIGERIAN_NAVY', 'NIGERIAN_AIR_FORCE', 'DEFENCE_INTELLIGENCE_AGENCY', 'OTHER') NOT NULL,
    `commandingOfficer` VARCHAR(191) NULL,
    `securityClassification` ENUM('UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET') NOT NULL DEFAULT 'UNCLASSIFIED',
    `currentStatus` ENUM('ACTIVE', 'OPERATIONAL', 'UNDER_MAINTENANCE', 'AWAITING_REPAIR', 'IN_STORAGE', 'DECOMMISSIONED', 'LOST', 'MISSING') NOT NULL DEFAULT 'ACTIVE',
    `operationalHours` DECIMAL(10, 2) NULL,
    `mileage` DECIMAL(12, 2) NULL,
    `lastInspectionDate` DATETIME(3) NULL,
    `nextMaintenanceDate` DATETIME(3) NULL,
    `availabilityPercentage` DECIMAL(5, 2) NULL,
    `hasOperatingManual` BOOLEAN NOT NULL DEFAULT false,
    `trainingRequirements` TEXT NULL,
    `safetyNotes` TEXT NULL,
    `insuranceInfo` TEXT NULL,
    `specialHandling` TEXT NULL,
    `environmentalNotes` TEXT NULL,
    `relatedEquipment` TEXT NULL,
    `backupSystems` TEXT NULL,
    `technicalSupport` TEXT NULL,
    `notes` TEXT NULL,
    `registeredById` VARCHAR(191) NOT NULL,
    `approvedById` VARCHAR(191) NULL,
    `authorizedById` VARCHAR(191) NULL,
    `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvalDate` DATETIME(3) NULL,
    `authorizationDate` DATETIME(3) NULL,
    `referenceNumber` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipment_chasisNumber_key`(`chasisNumber`),
    UNIQUE INDEX `equipment_referenceNumber_key`(`referenceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warranty_info` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `coverageDetails` TEXT NULL,
    `warrantyProvider` VARCHAR(191) NULL,
    `contactInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `warranty_info_equipmentId_key`(`equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `assignmentType` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_records` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `maintenanceType` ENUM('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'OVERHAUL') NOT NULL,
    `serviceProvider` ENUM('IN_HOUSE', 'CONTRACTED', 'MANUFACTURER', 'THIRD_PARTY') NOT NULL,
    `scheduledDate` DATETIME(3) NOT NULL,
    `completedDate` DATETIME(3) NULL,
    `description` TEXT NOT NULL,
    `partsReplaced` TEXT NULL,
    `cost` DECIMAL(12, 2) NULL,
    `technicianId` VARCHAR(191) NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE') NOT NULL DEFAULT 'SCHEDULED',
    `nextServiceDate` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_records` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `inspectorId` VARCHAR(191) NOT NULL,
    `inspectionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inspectionType` VARCHAR(191) NOT NULL,
    `result` ENUM('PASS', 'FAIL', 'CONDITIONAL', 'NEEDS_REPAIR') NOT NULL,
    `findings` TEXT NULL,
    `recommendations` TEXT NULL,
    `nextInspectionDate` DATETIME(3) NULL,
    `certificateNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_transfers` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `fromUnit` ENUM('NIGERIAN_ARMY', 'NIGERIAN_NAVY', 'NIGERIAN_AIR_FORCE', 'DEFENCE_INTELLIGENCE_AGENCY', 'OTHER') NOT NULL,
    `toUnit` ENUM('NIGERIAN_ARMY', 'NIGERIAN_NAVY', 'NIGERIAN_AIR_FORCE', 'DEFENCE_INTELLIGENCE_AGENCY', 'OTHER') NOT NULL,
    `fromLocation` VARCHAR(191) NOT NULL,
    `toLocation` VARCHAR(191) NOT NULL,
    `transferDate` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `initiatedById` VARCHAR(191) NOT NULL,
    `approvedById` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disposal_records` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `disposalMethod` ENUM('SALE', 'DONATION', 'SCRAP', 'DESTRUCTION', 'RETURN_TO_MANUFACTURER', 'RECYCLING') NOT NULL,
    `disposalDate` DATETIME(3) NOT NULL,
    `reason` TEXT NOT NULL,
    `approvedBy` VARCHAR(191) NOT NULL,
    `cost` DECIMAL(12, 2) NULL,
    `recycleValue` DECIMAL(12, 2) NULL,
    `disposalCompany` VARCHAR(191) NULL,
    `certificateNo` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `disposal_records_equipmentId_key`(`equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_access` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessLevel` ENUM('VIEW_ONLY', 'OPERATE', 'MAINTAIN', 'FULL_ACCESS', 'ADMINISTRATIVE') NOT NULL,
    `grantedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NULL,
    `grantedBy` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `purpose` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_documents` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `category` ENUM('PHOTO', 'TECHNICAL_DRAWING', 'SCHEMATIC', 'USER_MANUAL', 'MAINTENANCE_LOG', 'INSPECTION_REPORT', 'CERTIFICATE', 'LICENSE', 'PURCHASE_DOCUMENT', 'WARRANTY', 'TRAINING_MATERIAL', 'OTHER') NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `version` VARCHAR(191) NULL DEFAULT '1.0',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_registeredById_fkey` FOREIGN KEY (`registeredById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_authorizedById_fkey` FOREIGN KEY (`authorizedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_info` ADD CONSTRAINT `warranty_info_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_assignments` ADD CONSTRAINT `equipment_assignments_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_assignments` ADD CONSTRAINT `equipment_assignments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_records` ADD CONSTRAINT `inspection_records_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection_records` ADD CONSTRAINT `inspection_records_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_transfers` ADD CONSTRAINT `equipment_transfers_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_transfers` ADD CONSTRAINT `equipment_transfers_initiatedById_fkey` FOREIGN KEY (`initiatedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_transfers` ADD CONSTRAINT `equipment_transfers_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposal_records` ADD CONSTRAINT `disposal_records_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_access` ADD CONSTRAINT `equipment_access_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_access` ADD CONSTRAINT `equipment_access_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_documents` ADD CONSTRAINT `equipment_documents_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
