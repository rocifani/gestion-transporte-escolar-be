import { MigrationInterface, QueryRunner } from "typeorm";

export class TripsM1743877142750 implements MigrationInterface {
    name = 'TripsM1743877142750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`childrenChildId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_c461434f5eafcee98983f08d382\` FOREIGN KEY (\`childrenChildId\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_c461434f5eafcee98983f08d382\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`childrenChildId\``);
    }

}
