import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDniToAuthotization1744586974038 implements MigrationInterface {
    name = 'AddDniToAuthotization1744586974038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`dni\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`dni\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`dni\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`dni\``);
    }

}
