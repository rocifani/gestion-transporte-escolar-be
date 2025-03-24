import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChildTable1742827052677 implements MigrationInterface {
    name = 'CreateChildTable1742827052677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`child\` (\`child_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`age\` int NOT NULL, \`school\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`child_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_2d3276db048246e9b49b3c63f29\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_2d3276db048246e9b49b3c63f29\``);
        await queryRunner.query(`DROP TABLE \`child\``);
    }

}
