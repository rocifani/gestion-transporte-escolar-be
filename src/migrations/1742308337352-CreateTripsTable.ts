import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTripsTable1742308337352 implements MigrationInterface {
    name = 'CreateTripsTable1742308337352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`trip\` (\`trip_id\` int NOT NULL AUTO_INCREMENT, \`school\` varchar(255) NOT NULL, \`date\` date NULL, \`status\` enum ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`trip_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_f89812be41bd7d29f98d43445ee\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_f89812be41bd7d29f98d43445ee\``);
        await queryRunner.query(`DROP TABLE \`trip\``);
    }

}
