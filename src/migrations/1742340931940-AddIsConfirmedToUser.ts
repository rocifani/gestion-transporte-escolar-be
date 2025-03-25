import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsConfirmedToUser1742340931940 implements MigrationInterface {
    name = 'AddIsConfirmedToUser1742340931940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`is_confirmed\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_confirmed\``);
    }

}
