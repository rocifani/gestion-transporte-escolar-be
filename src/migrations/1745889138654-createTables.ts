import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1745889138654 implements MigrationInterface {
    name = 'CreateTables1745889138654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`school\``);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`school_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`school_address\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`school_address\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`school_name\``);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`school\` varchar(255) NOT NULL`);
    }

}
