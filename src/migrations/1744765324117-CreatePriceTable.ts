import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePriceTable1744765324117 implements MigrationInterface {
    name = 'CreatePriceTable1744765324117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`price\` (\`price_id\` int NOT NULL AUTO_INCREMENT, \`monthly_price\` int NOT NULL, \`weekly_price\` int NOT NULL, \`date_from\` timestamp NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`userId\` int NULL, PRIMARY KEY (\`price_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`price\` ADD CONSTRAINT \`FK_4e0f084c9bc8bb0992519b8bcca\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`price\` DROP FOREIGN KEY \`FK_4e0f084c9bc8bb0992519b8bcca\``);
        await queryRunner.query(`DROP TABLE \`price\``);
    }

}
