"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsPayedTrip1746882208300 = void 0;
class AddIsPayedTrip1746882208300 {
    constructor() {
        this.name = 'AddIsPayedTrip1746882208300';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`is_paid\` tinyint NOT NULL DEFAULT 0`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`is_paid\``);
    }
}
exports.AddIsPayedTrip1746882208300 = AddIsPayedTrip1746882208300;
