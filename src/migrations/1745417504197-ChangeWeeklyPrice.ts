import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeWeeklyPrice1745417504197 implements MigrationInterface {
    name = 'ChangeWeeklyPrice1745417504197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_2d3276db048246e9b49b3c63f29\``);
        await queryRunner.query(`ALTER TABLE \`price\` DROP FOREIGN KEY \`FK_4e0f084c9bc8bb0992519b8bcca\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_4a5e778bd1176e34bec66a1a063\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_7cbea905e769de14fd99019b8cd\``);
        await queryRunner.query(`ALTER TABLE \`child\` CHANGE \`userId\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`price\` CHANGE \`userId\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP COLUMN \`childIdChildId\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP COLUMN \`tripIdTripId\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD \`child_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD \`trip_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_9ad6817f4b1478bc421df7c0981\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`price\` ADD CONSTRAINT \`FK_5175665a7ced7b83513c57bcc2b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_57abeb88b7a450d2818a8401ee2\` FOREIGN KEY (\`child_id\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_f0a9bc6a401687c773d2112b73b\` FOREIGN KEY (\`trip_id\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_f0a9bc6a401687c773d2112b73b\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_57abeb88b7a450d2818a8401ee2\``);
        await queryRunner.query(`ALTER TABLE \`price\` DROP FOREIGN KEY \`FK_5175665a7ced7b83513c57bcc2b\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_9ad6817f4b1478bc421df7c0981\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP COLUMN \`trip_id\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP COLUMN \`child_id\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD \`tripIdTripId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD \`childIdChildId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`price\` CHANGE \`user_id\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` CHANGE \`user_id\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_7cbea905e769de14fd99019b8cd\` FOREIGN KEY (\`childIdChildId\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_4a5e778bd1176e34bec66a1a063\` FOREIGN KEY (\`tripIdTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`price\` ADD CONSTRAINT \`FK_4e0f084c9bc8bb0992519b8bcca\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_2d3276db048246e9b49b3c63f29\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
