"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStatusToTrip1747141314759 = void 0;
class AddStatusToTrip1747141314759 {
    constructor() {
        this.name = 'AddStatusToTrip1747141314759';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`status\` \`status\` enum ('pending', 'in progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` CHANGE \`status\` \`status\` enum ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }
}
exports.AddStatusToTrip1747141314759 = AddStatusToTrip1747141314759;
