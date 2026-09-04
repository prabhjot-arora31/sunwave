-- AlterTable
ALTER TABLE `Lead` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL,
    `systemType` VARCHAR(191) NULL,
    `comment` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_status_idx`(`status`),
    INDEX `Review_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
