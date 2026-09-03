-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NOT NULL,
    `city` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NULL,
    `propertyType` VARCHAR(191) NOT NULL,
    `monthlyBill` INTEGER NULL,
    `monthlyUnits` INTEGER NULL,
    `connectionType` VARCHAR(191) NULL,
    `capacity` VARCHAR(191) NULL,
    `roofType` VARCHAR(191) NULL,
    `installDate` DATETIME(3) NULL,
    `battery` VARCHAR(191) NULL,
    `finance` VARCHAR(191) NULL,
    `subsidy` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Lead_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
