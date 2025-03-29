import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorization1743261966012 implements MigrationInterface {
    name = 'AddAuthorization1743261966012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`authorization_pdf\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`vehicle_authorization_pdf\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`driver_authorization_pdf\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`driver_authorization_pdf\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`vehicle_authorization_pdf\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`authorization_pdf\` varchar(255) NULL`);
    }

}
