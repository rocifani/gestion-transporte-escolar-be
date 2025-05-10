import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceForTripAndUbc1746828149133 implements MigrationInterface {
    name = 'AddPriceForTripAndUbc1746828149133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`total_price\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`ubc\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`ubc\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`total_price\``);
    }

}
