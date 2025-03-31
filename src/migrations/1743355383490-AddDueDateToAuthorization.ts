import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDueDateToAuthorization1743355383490 implements MigrationInterface {
    name = 'AddDueDateToAuthorization1743355383490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`due_date\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`due_date\``);
    }

}
