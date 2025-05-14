"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAll1746385556170 = void 0;
class CreateAll1746385556170 {
    constructor() {
        this.name = 'CreateAll1746385556170';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`child\` (\`child_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`age\` int NOT NULL, \`school_name\` varchar(255) NOT NULL, \`school_address\` varchar(255) NOT NULL, \`school_shift\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`user_id\` int NULL, PRIMARY KEY (\`child_id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`trip_child\` (\`trip_child_id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`child_id\` int NULL, \`trip_id\` int NULL, PRIMARY KEY (\`trip_child_id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`trip\` (\`trip_id\` int NOT NULL AUTO_INCREMENT, \`date\` date NULL, \`available_capacity\` int NOT NULL, \`status\` enum ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`authorization_id\` int NULL, PRIMARY KEY (\`trip_id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`authorization\` (\`authorization_id\` int NOT NULL AUTO_INCREMENT, \`driver_name\` varchar(255) NOT NULL, \`dni\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`school_name\` varchar(255) NOT NULL, \`school_address\` varchar(255) NOT NULL, \`work_shift\` varchar(255) NOT NULL, \`vehicle_make\` varchar(255) NOT NULL, \`vehicle_model\` varchar(255) NOT NULL, \`vehicle_year\` int NOT NULL, \`vehicle_license_plate\` varchar(255) NOT NULL, \`vehicle_capacity\` int NOT NULL, \`vehicle_authorization_pdf\` varchar(255) NULL, \`driver_authorization_pdf\` varchar(255) NULL, \`due_date_vehicle\` date NOT NULL, \`due_date_driver\` date NOT NULL, \`state\` int NOT NULL, \`rejection_reason\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` int NULL, UNIQUE INDEX \`IDX_89bd5b128ac14d22fd2306a212\` (\`vehicle_license_plate\`), PRIMARY KEY (\`authorization_id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`price\` (\`price_id\` int NOT NULL AUTO_INCREMENT, \`monthly_price\` int NOT NULL, \`daily_price\` int NOT NULL, \`date_from\` timestamp NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`user_id\` int NULL, PRIMARY KEY (\`price_id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dni\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`role_id\` int NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`full_name\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NULL, \`address\` varchar(255) NULL, \`profile_picture\` varchar(255) NULL, \`birth_date\` date NULL, \`is_confirmed\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_9ad6817f4b1478bc421df7c0981\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_57abeb88b7a450d2818a8401ee2\` FOREIGN KEY (\`child_id\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_f0a9bc6a401687c773d2112b73b\` FOREIGN KEY (\`trip_id\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_668ce658944dfd516cb5f3f75ca\` FOREIGN KEY (\`authorization_id\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`authorization\` ADD CONSTRAINT \`FK_e23b6a20b3634c634bef6400069\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`price\` ADD CONSTRAINT \`FK_5175665a7ced7b83513c57bcc2b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`price\` DROP FOREIGN KEY \`FK_5175665a7ced7b83513c57bcc2b\``);
            yield queryRunner.query(`ALTER TABLE \`authorization\` DROP FOREIGN KEY \`FK_e23b6a20b3634c634bef6400069\``);
            yield queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_668ce658944dfd516cb5f3f75ca\``);
            yield queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_f0a9bc6a401687c773d2112b73b\``);
            yield queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_57abeb88b7a450d2818a8401ee2\``);
            yield queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_9ad6817f4b1478bc421df7c0981\``);
            yield queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
            yield queryRunner.query(`DROP TABLE \`user\``);
            yield queryRunner.query(`DROP TABLE \`price\``);
            yield queryRunner.query(`DROP INDEX \`IDX_89bd5b128ac14d22fd2306a212\` ON \`authorization\``);
            yield queryRunner.query(`DROP TABLE \`authorization\``);
            yield queryRunner.query(`DROP TABLE \`trip\``);
            yield queryRunner.query(`DROP TABLE \`trip_child\``);
            yield queryRunner.query(`DROP TABLE \`child\``);
        });
    }
}
exports.CreateAll1746385556170 = CreateAll1746385556170;
