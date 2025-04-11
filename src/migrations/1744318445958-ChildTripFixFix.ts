import { MigrationInterface, QueryRunner } from "typeorm";

export class ChildTripFixFix1744318445958 implements MigrationInterface {
    name = 'ChildTripFixFix1744318445958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_7d33fe9be654e4cd2732db3a17c\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` CHANGE \`tripTripId\` \`tripIdTripId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_4a5e778bd1176e34bec66a1a063\` FOREIGN KEY (\`tripIdTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_4a5e778bd1176e34bec66a1a063\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` CHANGE \`tripIdTripId\` \`tripTripId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_7d33fe9be654e4cd2732db3a17c\` FOREIGN KEY (\`tripTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
