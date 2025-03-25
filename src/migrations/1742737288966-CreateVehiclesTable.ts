import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehiclesTable1742737288966 implements MigrationInterface {
    name = 'CreateVehiclesTable1742737288966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vehicle\` (\`vehicle_id\` int NOT NULL AUTO_INCREMENT, \`make\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`year\` int NOT NULL, \`licensePlate\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`authorization_pdf\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`userId\` int NULL, UNIQUE INDEX \`IDX_a654a0355ae4c5ba31c5f6c892\` (\`licensePlate\`), UNIQUE INDEX \`REL_86aea53f0b2b4f046e25e8315d\` (\`userId\`), PRIMARY KEY (\`vehicle_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`vehicleVehicleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_6c59d04eef7fda34af6fc48172a\` FOREIGN KEY (\`vehicleVehicleId\`) REFERENCES \`vehicle\`(\`vehicle_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD CONSTRAINT \`FK_86aea53f0b2b4f046e25e8315d1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP FOREIGN KEY \`FK_86aea53f0b2b4f046e25e8315d1\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_6c59d04eef7fda34af6fc48172a\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`vehicleVehicleId\``);
        await queryRunner.query(`DROP INDEX \`REL_86aea53f0b2b4f046e25e8315d\` ON \`vehicle\``);
        await queryRunner.query(`DROP INDEX \`IDX_a654a0355ae4c5ba31c5f6c892\` ON \`vehicle\``);
        await queryRunner.query(`DROP TABLE \`vehicle\``);
    }

}
