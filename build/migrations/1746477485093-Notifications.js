"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications1746477485093 = void 0;
class Notifications1746477485093 {
    constructor() {
        this.name = 'Notifications1746477485093';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`notification_id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`detail\` varchar(255) NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp NULL, \`user_id\` int NULL, PRIMARY KEY (\`notification_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_928b7aa1754e08e1ed7052cb9d8\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_928b7aa1754e08e1ed7052cb9d8\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }
}
exports.Notifications1746477485093 = Notifications1746477485093;
