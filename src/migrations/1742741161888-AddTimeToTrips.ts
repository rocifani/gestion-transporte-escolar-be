import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimeToTrips1742741161888 implements MigrationInterface {
    name = 'AddTimeToTrips1742741161888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`time\` time NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`time\``);
    }

}
