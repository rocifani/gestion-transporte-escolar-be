import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTrip1743866180102 implements MigrationInterface {
    name = 'ModifyTrip1743866180102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`tripTripId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_5276ee3afe795eec63d45f44caa\` FOREIGN KEY (\`tripTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_5276ee3afe795eec63d45f44caa\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`tripTripId\``);
    }

}
