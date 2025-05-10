import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPayedTrip1746882208300 implements MigrationInterface {
    name = 'AddIsPayedTrip1746882208300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`is_paid\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`is_paid\``);
    }

}
