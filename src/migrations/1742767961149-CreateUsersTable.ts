import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1742767961149 implements MigrationInterface {
    name = 'CreateUsersTable1742767961149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
    }

}
