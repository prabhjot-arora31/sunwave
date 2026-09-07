-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `email` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `leadId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_leadId_key`(`leadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CustomerDocument_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerDocument` ADD CONSTRAINT `CustomerDocument_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Data migration: preserve existing LeadDocument rows instead of losing them.
-- Create one Customer per distinct Lead that currently has documents...
INSERT INTO `Customer` (`fullName`, `phone`, `address`, `email`, `leadId`, `createdAt`, `updatedAt`)
SELECT DISTINCT l.`fullName`, l.`mobile`, l.`address`, l.`email`, l.`id`, NOW(3), NOW(3)
FROM `Lead` l
WHERE l.`id` IN (SELECT DISTINCT `leadId` FROM `LeadDocument`);

-- ...then re-point each document at its lead's new Customer.
INSERT INTO `CustomerDocument` (`customerId`, `label`, `url`, `fileName`, `createdAt`)
SELECT c.`id`, ld.`label`, ld.`url`, ld.`fileName`, ld.`createdAt`
FROM `LeadDocument` ld
JOIN `Customer` c ON c.`leadId` = ld.`leadId`;

-- DropForeignKey
ALTER TABLE `LeadDocument` DROP FOREIGN KEY `LeadDocument_leadId_fkey`;

-- DropTable
DROP TABLE `LeadDocument`;
