import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtChildren1742932085579 implements MigrationInterface {
    name = 'AddDeletedAtChildren1742932085579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`deleted_at\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`created_at\``);
    }

}
