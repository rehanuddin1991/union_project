-- AlterTable
ALTER TABLE `certificate` ADD COLUMN `holding_no` VARCHAR(191) NULL,
    ADD COLUMN `mouza` VARCHAR(191) NULL,
    ADD COLUMN `nid` VARCHAR(191) NULL,
    ADD COLUMN `post_office` VARCHAR(191) NULL,
    ADD COLUMN `ward` INTEGER NOT NULL DEFAULT 0;
