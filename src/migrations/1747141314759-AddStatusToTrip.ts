import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToTrip1747141314759 implements MigrationInterface {
    name = 'AddStatusToTrip1747141314759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`status\` \`status\` enum ('pending', 'in progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`status\` \`status\` enum ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }

}
