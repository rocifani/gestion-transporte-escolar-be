import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancelReason1747231991019 implements MigrationInterface {
    name = 'AddCancelReason1747231991019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`cancel_reason\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`cancel_reason\``);
    }

}
