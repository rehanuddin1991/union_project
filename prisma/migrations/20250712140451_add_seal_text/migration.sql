-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holding_Information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `headName` VARCHAR(191) NOT NULL,
    `ward` INTEGER NOT NULL,
    `holdingNo` VARCHAR(191) NOT NULL,
    `father` VARCHAR(191) NOT NULL,
    `mother` VARCHAR(191) NOT NULL,
    `nid` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `occupation` VARCHAR(191) NOT NULL,
    `maleMembers` INTEGER NOT NULL,
    `femaleMembers` INTEGER NOT NULL,
    `othersMembers` INTEGER NOT NULL,
    `maleBaby` INTEGER NOT NULL,
    `femaleBaby` INTEGER NOT NULL,
    `othersBaby` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `multiStoriedRoom` INTEGER NOT NULL,
    `buildingRoom` INTEGER NOT NULL,
    `semiBuildingRoom` INTEGER NOT NULL,
    `ownHouseRent` INTEGER NOT NULL,
    `othersRent` INTEGER NOT NULL,
    `imposedTax` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Holding_Information_nid_key`(`nid`),
    UNIQUE INDEX `Holding_Information_ward_holdingNo_key`(`ward`, `holdingNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HoldingCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `holdingInformationId` INTEGER NOT NULL,
    `holdingNumber` VARCHAR(191) NOT NULL,
    `fiscalYear` ENUM('Y2022_2023', 'Y2023_2024', 'Y2024_2025', 'Y2025_2026', 'Y2026_2027', 'Y2027_2028', 'Y2028_2029', 'Y2029_2030', 'Y2031_2032', 'Y2032_2033', 'Y2033_2034', 'Y2034_2035') NOT NULL DEFAULT 'Y2025_2026',
    `amount` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HoldingCollection_holdingInformationId_idx`(`holdingInformationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `issuedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 1,
    `designation` ENUM('OFFICER_IN_CHARGE', 'CHAIRMAN', 'ADMINISTRATIVE_OFFICER', 'ACCOUNTANT_COMPUTER_OPERATOR') NOT NULL DEFAULT 'CHAIRMAN',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfficeSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notes` TEXT NULL,
    `sarok_no` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HoldingCollection` ADD CONSTRAINT `HoldingCollection_holdingInformationId_fkey` FOREIGN KEY (`holdingInformationId`) REFERENCES `Holding_Information`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
