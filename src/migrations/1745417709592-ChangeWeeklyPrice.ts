import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeWeeklyPrice1745417709592 implements MigrationInterface {
    name = 'ChangeWeeklyPrice1745417709592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_384cfe3dfa09dd7a6be486c3619\``);
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`authorizationAuthorizationId\` \`authorization_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_668ce658944dfd516cb5f3f75ca\` FOREIGN KEY (\`authorization_id\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_668ce658944dfd516cb5f3f75ca\``);
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`authorization_id\` \`authorizationAuthorizationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_384cfe3dfa09dd7a6be486c3619\` FOREIGN KEY (\`authorizationAuthorizationId\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
