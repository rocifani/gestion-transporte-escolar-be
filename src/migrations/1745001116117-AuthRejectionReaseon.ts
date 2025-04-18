import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthRejectionReaseon1745001116117 implements MigrationInterface {
    name = 'AuthRejectionReaseon1745001116117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`rejection_reason\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`rejection_reason\``);
    }

}
