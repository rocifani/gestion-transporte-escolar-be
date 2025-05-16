"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPriceForTripAndUbc1746828149133 = void 0;
class AddPriceForTripAndUbc1746828149133 {
    constructor() {
        this.name = 'AddPriceForTripAndUbc1746828149133';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`total_price\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authorization\` ADD \`ubc\` varchar(255) NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`ubc\``);
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`total_price\``);
    }
}
exports.AddPriceForTripAndUbc1746828149133 = AddPriceForTripAndUbc1746828149133;
