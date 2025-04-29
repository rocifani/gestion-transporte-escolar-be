import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchool1745936166756 implements MigrationInterface {
    name = 'UpdateSchool1745936166756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`school\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`school_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`school_address\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`school_address\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`school_name\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`school\` varchar(255) NOT NULL`);
    }

}
