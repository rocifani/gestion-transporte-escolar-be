import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchoolShiftToChild1743973443468 implements MigrationInterface {
    name = 'AddSchoolShiftToChild1743973443468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_5276ee3afe795eec63d45f44caa\``);
        await queryRunner.query(`ALTER TABLE \`child\` CHANGE \`tripTripId\` \`school_shift\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`school_shift\``);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`school_shift\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`school_shift\``);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`school_shift\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` CHANGE \`school_shift\` \`tripTripId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_5276ee3afe795eec63d45f44caa\` FOREIGN KEY (\`tripTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
