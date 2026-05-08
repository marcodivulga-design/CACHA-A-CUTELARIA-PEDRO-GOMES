-- Organizations
CREATE TABLE IF NOT EXISTS `organizations` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `description` text,
  `logo` text,
  `website` varchar(255),
  `email` varchar(255),
  `phone` varchar(20),
  `address` text,
  `city` varchar(100),
  `state` varchar(2),
  `zip_code` varchar(10),
  `country` varchar(100) DEFAULT 'BR',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) PRIMARY KEY,
  `email` varchar(255) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20),
  `avatar` text,
  `role` enum('admin', 'user', 'customer') DEFAULT 'customer',
  `organization_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  INDEX `org_idx` (`organization_id`)
);

-- Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `long_description` text,
  `price` decimal(10, 2) NOT NULL,
  `original_price` decimal(10, 2),
  `discount` int DEFAULT 0,
  `blade_length` int,
  `weight` int,
  `handle_type` varchar(100),
  `steel_type` varchar(100),
  `main_image` text,
  `rating` decimal(3, 2) DEFAULT 0,
  `review_count` int DEFAULT 0,
  `stock` int DEFAULT 0,
  `sku` varchar(100) UNIQUE,
  `active` boolean DEFAULT true,
  `featured` boolean DEFAULT false,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `slug_idx` (`slug`)
);

-- Product Images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` varchar(36) PRIMARY KEY,
  `product_id` varchar(36) NOT NULL,
  `image_url` text NOT NULL,
  `photo_type` enum('frontal', 'lateral', 'detalhe', 'uso', 'ambiente') DEFAULT 'frontal',
  `title` varchar(255),
  `order` int DEFAULT 0,
  `is_main` boolean DEFAULT false,
  `is_active` boolean DEFAULT true,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  INDEX `product_idx` (`product_id`)
);

-- Product Variations
CREATE TABLE IF NOT EXISTS `product_variations` (
  `id` varchar(36) PRIMARY KEY,
  `product_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price_modifier` decimal(10, 2) DEFAULT 0,
  `stock` int DEFAULT 0,
  `image_url` text,
  `sku` varchar(100) UNIQUE,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  INDEX `product_idx` (`product_id`)
);

-- Customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `user_id` varchar(36),
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20),
  `cpf` varchar(14) UNIQUE,
  `birth_date` datetime,
  `gender` enum('M', 'F', 'O'),
  `newsletter` boolean DEFAULT false,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `email_idx` (`email`)
);

-- Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `customer_id` varchar(36) NOT NULL,
  `order_number` varchar(50) NOT NULL UNIQUE,
  `status` enum('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  `subtotal` decimal(10, 2) NOT NULL,
  `discount` decimal(10, 2) DEFAULT 0,
  `shipping` decimal(10, 2) DEFAULT 0,
  `tax` decimal(10, 2) DEFAULT 0,
  `total` decimal(10, 2) NOT NULL,
  `payment_method` enum('credit_card', 'pix', 'boleto', 'crypto'),
  `payment_status` enum('pending', 'approved', 'failed', 'refunded') DEFAULT 'pending',
  `transaction_id` varchar(255),
  `shipping_address` json,
  `billing_address` json,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `customer_idx` (`customer_id`),
  INDEX `status_idx` (`status`)
);

-- Order Items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` varchar(36) PRIMARY KEY,
  `order_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `variation_id` varchar(36),
  `quantity` int NOT NULL,
  `unit_price` decimal(10, 2) NOT NULL,
  `discount` decimal(10, 2) DEFAULT 0,
  `total` decimal(10, 2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`variation_id`) REFERENCES `product_variations`(`id`),
  INDEX `order_idx` (`order_id`),
  INDEX `product_idx` (`product_id`)
);

-- Payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `method` enum('credit_card', 'pix', 'boleto', 'crypto') NOT NULL,
  `status` enum('pending', 'approved', 'failed', 'refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) UNIQUE,
  `gateway` varchar(100),
  `gateway_response` json,
  `metadata` json,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `order_idx` (`order_id`),
  INDEX `status_idx` (`status`)
);

-- Shipments
CREATE TABLE IF NOT EXISTS `shipments` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `tracking_code` varchar(100) UNIQUE,
  `carrier` varchar(100),
  `status` enum('pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
  `estimated_delivery` datetime,
  `actual_delivery` datetime,
  `weight` decimal(10, 3),
  `dimensions` json,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `order_idx` (`order_id`),
  INDEX `tracking_idx` (`tracking_code`)
);

-- Tracking Events
CREATE TABLE IF NOT EXISTS `tracking_events` (
  `id` varchar(36) PRIMARY KEY,
  `shipment_id` varchar(36) NOT NULL,
  `status` varchar(100) NOT NULL,
  `location` varchar(255),
  `description` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`),
  INDEX `shipment_idx` (`shipment_id`)
);

-- Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `customer_id` varchar(36) NOT NULL,
  `order_id` varchar(36),
  `rating` int NOT NULL,
  `title` varchar(255),
  `comment` text,
  `verified` boolean DEFAULT false,
  `helpful` int DEFAULT 0,
  `unhelpful` int DEFAULT 0,
  `status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `product_idx` (`product_id`),
  INDEX `customer_idx` (`customer_id`)
);

-- Review Images
CREATE TABLE IF NOT EXISTS `review_images` (
  `id` varchar(36) PRIMARY KEY,
  `review_id` varchar(36) NOT NULL,
  `image_url` text NOT NULL,
  `order` int DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`),
  INDEX `review_idx` (`review_id`)
);

-- Conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `customer_id` varchar(36),
  `channel` enum('web', 'whatsapp', 'telegram', 'email') DEFAULT 'web',
  `status` enum('active', 'closed', 'escalated') DEFAULT 'active',
  `sentiment` enum('positive', 'neutral', 'negative') DEFAULT 'neutral',
  `escalated_to_human` boolean DEFAULT false,
  `agent_id` varchar(36),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` datetime,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `customer_idx` (`customer_id`),
  INDEX `status_idx` (`status`)
);

-- Messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` varchar(36) PRIMARY KEY,
  `conversation_id` varchar(36) NOT NULL,
  `role` enum('user', 'assistant', 'agent') NOT NULL,
  `content` text NOT NULL,
  `sentiment` enum('positive', 'neutral', 'negative'),
  `metadata` json,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`),
  INDEX `conversation_idx` (`conversation_id`)
);

-- Recommendations
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `conversation_id` varchar(36),
  `customer_id` varchar(36),
  `product_id` varchar(36) NOT NULL,
  `reason` text,
  `match_score` int,
  `clicked` boolean DEFAULT false,
  `purchased` boolean DEFAULT false,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `conversation_idx` (`conversation_id`),
  INDEX `customer_idx` (`customer_id`)
);

-- Events
CREATE TABLE IF NOT EXISTS `events` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `customer_id` varchar(36),
  `event_type` varchar(100) NOT NULL,
  `event_data` json,
  `user_agent` text,
  `ip_address` varchar(45),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `type_idx` (`event_type`)
);

-- Page Views
CREATE TABLE IF NOT EXISTS `page_views` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(36) NOT NULL,
  `customer_id` varchar(36),
  `page` varchar(255) NOT NULL,
  `referrer` varchar(255),
  `duration` int,
  `scroll_depth` int,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`),
  INDEX `org_idx` (`organization_id`),
  INDEX `page_idx` (`page`)
);
