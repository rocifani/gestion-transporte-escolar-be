import { MigrationInterface, QueryRunner } from "typeorm";

export class ChildTrip1744318044555 implements MigrationInterface {
    name = 'ChildTrip1744318044555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_0f77158353b2a70121516f6d48a\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_c461434f5eafcee98983f08d382\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_f89812be41bd7d29f98d43445ee\``);
        await queryRunner.query(`CREATE TABLE \`trip_child\` (\`trip_child_id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`childIdChildId\` int NULL, \`tripTripId\` int NULL, PRIMARY KEY (\`trip_child_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`school\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`vehicleAuthorizationId\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`time\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`childrenChildId\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`available_capacity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`authorizationAuthorizationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`state\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`tripChildIdTripChildId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_384cfe3dfa09dd7a6be486c3619\` FOREIGN KEY (\`authorizationAuthorizationId\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_7cbea905e769de14fd99019b8cd\` FOREIGN KEY (\`childIdChildId\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip_child\` ADD CONSTRAINT \`FK_7d33fe9be654e4cd2732db3a17c\` FOREIGN KEY (\`tripTripId\`) REFERENCES \`trip\`(\`trip_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD CONSTRAINT \`FK_3f98514fc242c11ffe24a0eaf02\` FOREIGN KEY (\`tripChildIdTripChildId\`) REFERENCES \`trip_child\`(\`trip_child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP FOREIGN KEY \`FK_3f98514fc242c11ffe24a0eaf02\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_7d33fe9be654e4cd2732db3a17c\``);
        await queryRunner.query(`ALTER TABLE \`trip_child\` DROP FOREIGN KEY \`FK_7cbea905e769de14fd99019b8cd\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP FOREIGN KEY \`FK_384cfe3dfa09dd7a6be486c3619\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`tripChildIdTripChildId\``);
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`state\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`authorizationAuthorizationId\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`available_capacity\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`childrenChildId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`time\` time NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`vehicleAuthorizationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`school\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`trip_child\``);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_f89812be41bd7d29f98d43445ee\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_c461434f5eafcee98983f08d382\` FOREIGN KEY (\`childrenChildId\`) REFERENCES \`child\`(\`child_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD CONSTRAINT \`FK_0f77158353b2a70121516f6d48a\` FOREIGN KEY (\`vehicleAuthorizationId\`) REFERENCES \`authorization\`(\`authorization_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
