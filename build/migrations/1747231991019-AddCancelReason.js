"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCancelReason1747231991019 = void 0;
class AddCancelReason1747231991019 {
    constructor() {
        this.name = 'AddCancelReason1747231991019';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`cancel_reason\` varchar(255) NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`cancel_reason\``);
    }
}
exports.AddCancelReason1747231991019 = AddCancelReason1747231991019;
