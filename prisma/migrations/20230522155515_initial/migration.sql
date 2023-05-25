-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(60) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(1000) NULL,
    `permissions` VARCHAR(4000) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `uuid`(`uuid`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provider_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('GOOGLE') NOT NULL,
    `provider_user_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `provider_user_id`(`provider_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `access_token` VARCHAR(4000) NOT NULL,
    `csrf_token` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `sid`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_id` VARCHAR(60) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `token_id`(`token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `one_time_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_id` VARCHAR(60) NOT NULL,
    `token_type` ENUM('RESET') NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `token_id`(`token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchantId` VARCHAR(10) NOT NULL,
    `merchantName` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `merchantId`(`merchantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branchs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchId` VARCHAR(5) NOT NULL,
    `branchName` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `merchantId` INTEGER NOT NULL,

    UNIQUE INDEX `shopId`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(25) NOT NULL,
    `lastName` VARCHAR(25) NOT NULL,
    `mobile1` VARCHAR(25) NOT NULL,
    `mobile2` VARCHAR(25) NOT NULL,
    `email1` VARCHAR(25) NOT NULL,
    `email2` VARCHAR(25) NOT NULL,
    `line` VARCHAR(25) NOT NULL,
    `facebook` VARCHAR(25) NOT NULL,
    `instagram` VARCHAR(25) NOT NULL,
    `whatapp` VARCHAR(25) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `merchantId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address1` VARCHAR(255) NOT NULL,
    `address2` VARCHAR(255) NOT NULL,
    `district` VARCHAR(25) NOT NULL,
    `county` VARCHAR(25) NOT NULL,
    `province` VARCHAR(25) NOT NULL,
    `zip` VARCHAR(5) NOT NULL,
    `location_lat` VARCHAR(20) NOT NULL,
    `location_long` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `contactId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assetId` VARCHAR(10) NOT NULL,
    `assetName` VARCHAR(8) NOT NULL,
    `assetStatus` ENUM('READY', 'QUEUE', 'BUSY', 'OFFLINE') NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `branchId` INTEGER NOT NULL,

    UNIQUE INDEX `assetId`(`assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('WASHER', 'DRYER') NOT NULL,
    `serialNumber` VARCHAR(15) NOT NULL,
    `model` VARCHAR(30) NOT NULL,
    `buyAt` DATETIME(0) NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `assetId` INTEGER NOT NULL,

    UNIQUE INDEX `serialNumber`(`serialNumber`),
    UNIQUE INDEX `machines_assetId_key`(`assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(10) NOT NULL,
    `shortDesc` VARCHAR(4) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` FLOAT NOT NULL,
    `unit` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `assetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceMac` VARCHAR(17) NOT NULL,
    `firmware` VARCHAR(15) NOT NULL,
    `deviceState` ENUM('ACTIVATED', 'REGISTERED', 'OUTSERVICE') NOT NULL,
    `machineId` INTEGER NOT NULL,

    UNIQUE INDEX `deviceMac`(`deviceMac`),
    UNIQUE INDEX `devices_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QrTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` VARCHAR(60) NOT NULL,
    `method` ENUM('QR_STATIC', 'QR_DYNAMIC', 'BLE_STATIC', 'BLE_DYNAMIC', 'NFC_STATIC', 'NFC_DYNAMIC') NOT NULL,
    `Application` ENUM('PROMPTPAY_CREDIT_TRANSFER', 'PROMPTPAY_CREDIT_TRANSFER_WITH_OTA', 'PROMPTPAY_BILL_PAYMENT', 'PROMPTPAY_BILL_PAYMENT_CROSS_BORDER') NOT NULL,
    `mobileNumber` VARCHAR(13) NOT NULL,
    `nationalID` VARCHAR(13) NOT NULL,
    `taxID` VARCHAR(13) NOT NULL,
    `eWalletID` VARCHAR(15) NOT NULL,
    `bankAccount` VARCHAR(43) NOT NULL,
    `ota` VARCHAR(10) NOT NULL,
    `billerID` VARCHAR(15) NOT NULL,
    `reference1` VARCHAR(20) NOT NULL,
    `reference2` VARCHAR(20) NOT NULL,
    `mcc` VARCHAR(4) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `amount` VARCHAR(13) NOT NULL,
    `tip` VARCHAR(13) NOT NULL,
    `countryCode` VARCHAR(2) NOT NULL,
    `merchantName` VARCHAR(25) NOT NULL,
    `merchantCity` VARCHAR(15) NOT NULL,
    `postalCode` VARCHAR(10) NOT NULL,
    `additional_billNumber` VARCHAR(26) NOT NULL,
    `additional_mobileNumber` VARCHAR(26) NOT NULL,
    `additional_storeID` VARCHAR(26) NOT NULL,
    `additional_loyaltyNumber` VARCHAR(26) NOT NULL,
    `additional_referenceID` VARCHAR(26) NOT NULL,
    `dditional_customerID` VARCHAR(26) NOT NULL,
    `additional_terminalID` VARCHAR(26) NOT NULL,
    `additional_purposeOfTransaction` VARCHAR(26) NOT NULL,
    `additional_additionalCustomerData` VARCHAR(3) NOT NULL,
    `merchantInformation` VARCHAR(99) NOT NULL,
    `sellerTaxBranchID` VARCHAR(4) NOT NULL,
    `vatRate` VARCHAR(5) NOT NULL,
    `vatAmount` VARCHAR(13) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `transactionID`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentWait` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `transactionID`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentNotify` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_Id` VARCHAR(60) NULL,
    `payment_shop` VARCHAR(25) NOT NULL,
    `payment_sender` VARCHAR(25) NOT NULL,
    `payment_time` DATETIME(3) NOT NULL,
    `payment_amount` VARCHAR(13) NOT NULL,
    `payment_message` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `payment_Id`(`payment_Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `provider_users` ADD CONSTRAINT `provider_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branchs` ADD CONSTRAINT `branchs_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `merchants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `merchants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branchs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branchs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `machines_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `machines`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
