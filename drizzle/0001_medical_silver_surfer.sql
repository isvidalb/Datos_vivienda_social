CREATE TABLE `plans_reguladores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(300) NOT NULL,
	`type` enum('comunal','intercomunal','metropolitano','seccional') NOT NULL DEFAULT 'comunal',
	`regionCode` varchar(8) NOT NULL,
	`comuna` varchar(150) NOT NULL,
	`status` enum('vigente','en_revision','en_actualizacion','propuesto') NOT NULL DEFAULT 'vigente',
	`densityMax` varchar(100),
	`densityMin` varchar(100),
	`landUsePermitted` text,
	`landUseConditional` text,
	`landUseProhibited` text,
	`restrictions` text,
	`aptForHousing` enum('si','no','condicionado') NOT NULL DEFAULT 'si',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plans_reguladores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`targetPopulation` text,
	`maxSubsidyUF` varchar(20),
	`incomeSegment` varchar(100),
	`investment2025UF` varchar(30),
	`housingUnits2025` int DEFAULT 0,
	`beneficiaries2025` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `programs_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(300) NOT NULL,
	`programCode` varchar(10) NOT NULL,
	`regionCode` varchar(8) NOT NULL,
	`comuna` varchar(150) NOT NULL,
	`address` varchar(300),
	`lat` varchar(20) NOT NULL,
	`lng` varchar(20) NOT NULL,
	`status` enum('seleccionado','en_ejecucion','terminado','entregado','por_iniciar') NOT NULL DEFAULT 'seleccionado',
	`projectType` enum('vivienda_nueva','mejoramiento','ampliacion','arriendo','densificacion') NOT NULL DEFAULT 'vivienda_nueva',
	`investmentUF` varchar(30),
	`housingUnits` int DEFAULT 0,
	`beneficiaries` int DEFAULT 0,
	`entityPatrocinante` varchar(200),
	`serviu` varchar(100),
	`planRegulador` varchar(200),
	`densityAllowed` varchar(100),
	`landUse` varchar(200),
	`zoning` varchar(200),
	`restrictions` text,
	`normative` text,
	`startDate` varchar(20),
	`endDate` varchar(20),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(8) NOT NULL,
	`name` varchar(120) NOT NULL,
	`capital` varchar(120),
	`lat` varchar(20),
	`lng` varchar(20),
	`isExtreme` enum('norte','sur','no') NOT NULL DEFAULT 'no',
	`deficitCuantitativo` int DEFAULT 0,
	`deficitCualitativo` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `regions_id` PRIMARY KEY(`id`),
	CONSTRAINT `regions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `stats_national` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(200) NOT NULL,
	`value` varchar(100) NOT NULL,
	`unit` varchar(50),
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stats_national_id` PRIMARY KEY(`id`)
);
