import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVehicleForAuthorization1743259716531 implements MigrationInterface {
    name = 'ChangeVehicleForAuthorization1743259716531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_6c59d04eef7fda34af6fc48172a\` ON \`trip\``);
        await queryRunner.query(`DROP INDEX \`FK_f89812be41bd7d29f98d43445ee\` ON \`trip\``);
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`vehicleVehicleId\` \`vehicleAuthorizationId\` int NULL`);
        await queryRunner.query(`CREATE TABLE \`authorization\` (\`authorization_id\` int NOT NULL AUTO_INCREMENT, \`driver_name\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`school\` varchar(255) NOT NULL, \`work_shift\` varchar(255) NOT NULL, \`vehicle_make\` varchar(255) NOT NULL, \`vehicle_model\` varchar(255) NOT NULL, \`vehicle_year\` int NOT NULL, \`vehicle_license_plate\` varchar(255) NOT NULL, \`vehicle_capacity\` int NOT NULL, \`authorization_pdf\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` int NULL, UNIQUE INDEX \`IDX_89bd5b128ac14d22fd2306a212\` (\`vehicle_license_plate\`), PRIMARY KEY (\`authorization_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD CONSTRAINT \`FK_e23b6a20b3634c634bef6400069\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_f89812be41bd7d29f98d43445ee\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_0f77158353b2a70121516f6d48a\` FOREIGN KEY (\`vehicleAuthorizationId\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE \`vehicle\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_0f77158353b2a70121516f6d48a\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_f89812be41bd7d29f98d43445ee\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP FOREIGN KEY \`FK_e23b6a20b3634c634bef6400069\``);
        await queryRunner.query(`DROP INDEX \`IDX_89bd5b128ac14d22fd2306a212\` ON \`authorization\``);
        await queryRunner.query(`DROP TABLE \`authorization\``);
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`vehicleAuthorizationId\` \`vehicleVehicleId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`FK_f89812be41bd7d29f98d43445ee\` ON \`trip\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_6c59d04eef7fda34af6fc48172a\` ON \`trip\` (\`vehicleVehicleId\`)`);
    }

}
