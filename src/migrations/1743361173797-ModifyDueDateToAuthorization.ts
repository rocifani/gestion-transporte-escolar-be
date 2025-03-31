import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDueDateToAuthorization1743361173797 implements MigrationInterface {
    name = 'ModifyDueDateToAuthorization1743361173797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`due_date\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`due_date_vehicle\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`due_date_driver\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`due_date_driver\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`due_date_vehicle\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`due_date\` date NOT NULL`);
    }

}
