import { MigrationInterface, QueryRunner } from "typeorm";

export class DailyPrice1745423672599 implements MigrationInterface {
    name = 'DailyPrice1745423672599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`price\` CHANGE \`weekly_price\` \`daily_price\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`price\` CHANGE \`daily_price\` \`weekly_price\` int NOT NULL`);
    }

}
