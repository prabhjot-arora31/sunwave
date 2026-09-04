-- CreateTable
CREATE TABLE `GalleryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GalleryItem_type_idx`(`type`),
    INDEX `GalleryItem_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
