-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `yearsExperience` VARCHAR(191) NOT NULL,
    `happyCustomers` VARCHAR(191) NOT NULL,
    `mwCapacity` VARCHAR(191) NOT NULL,
    `citiesServed` VARCHAR(191) NOT NULL,
    `loanAmount` VARCHAR(191) NOT NULL,
    `interestRate` VARCHAR(191) NOT NULL,
    `loanTenure` VARCHAR(191) NOT NULL,
    `loanProcessing` VARCHAR(191) NOT NULL,
    `financePartners` JSON NOT NULL,
    `subsidySlabs` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
