-- Crear tablas base primero
CREATE TABLE IF NOT EXISTS `protocols` (
	`protocol_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`title` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`summary` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`author` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`protocol_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `categories` (
	`category_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`description` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`category_name` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`category_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `groups` (
	`group_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`group_name` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`access_type` VARCHAR(20) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`group_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employees` (
	`employee_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`last_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`email` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`password` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`document_type` VARCHAR(10) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`document_num` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`phone` VARCHAR(15) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	`group_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`employee_id`) USING BTREE,
	INDEX `group_id` (`group_id`) USING BTREE,
	CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `stateemployees` (
	`stateEmployee_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`state_name` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`stateEmployee_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

-- Crear las tablas que tienen claves foráneas
CREATE TABLE IF NOT EXISTS `content` (
	`content_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`author` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`content` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`order` INT(11) NOT NULL,
	`image` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`document` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	`protocol_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`content_id`) USING BTREE,
	INDEX `protocol_id` (`protocol_id`) USING BTREE,
	CONSTRAINT `content_ibfk_1` FOREIGN KEY (`protocol_id`) REFERENCES `protocols` (`protocol_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employeestates` (
	`employeeState_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`stateEmployee_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`employee_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`created_date` DATETIME NOT NULL,
	PRIMARY KEY (`employeeState_id`) USING BTREE,
	INDEX `stateEmployee_id` (`stateEmployee_id`) USING BTREE,
	INDEX `employee_id` (`employee_id`) USING BTREE,
	CONSTRAINT `employeestates_ibfk_1` FOREIGN KEY (`stateEmployee_id`) REFERENCES `stateemployees` (`stateEmployee_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `employeestates_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `groupcategories` (
	`groupCategory_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`group_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`category_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`groupCategory_id`) USING BTREE,
	INDEX `group_id` (`group_id`) USING BTREE,
	INDEX `category_id` (`category_id`) USING BTREE,
	CONSTRAINT `groupcategories_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `groupcategories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `protocolcategories` (
	`protocolCategory_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`protocol_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`category_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`active` TINYINT(1) NOT NULL,
	`created_date` DATETIME NOT NULL,
	`updated_date` DATETIME NOT NULL,
	PRIMARY KEY (`protocolCategory_id`) USING BTREE,
	INDEX `protocol_id` (`protocol_id`) USING BTREE,
	INDEX `category_id` (`category_id`) USING BTREE,
	CONSTRAINT `protocolcategories_ibfk_1` FOREIGN KEY (`protocol_id`) REFERENCES `protocols` (`protocol_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `protocolcategories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `logs` (
	`id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`employee_id` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	`protocol_id` CHAR(32) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`date` DATETIME NOT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;
