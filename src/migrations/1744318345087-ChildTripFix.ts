import { MigrationInterface, QueryRunner } from "typeorm";

export class ChildTripFix1744318345087 implements MigrationInterface {
    name = 'ChildTripFix1744318345087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_3f98514fc242c11ffe24a0eaf02\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`tripChildIdTripChildId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`tripChildIdTripChildId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_3f98514fc242c11ffe24a0eaf02\` FOREIGN KEY (\`tripChildIdTripChildId\`) REFERENCES \`trip_child\`(\`trip_child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
