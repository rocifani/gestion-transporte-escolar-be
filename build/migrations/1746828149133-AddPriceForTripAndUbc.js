"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPriceForTripAndUbc1746828149133 = void 0;
class AddPriceForTripAndUbc1746828149133 {
    constructor() {
        this.name = 'AddPriceForTripAndUbc1746828149133';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`trip\` ADD \`total_price\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`authorization\` ADD \`ubc\` varchar(255) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`authorization\` DROP COLUMN \`ubc\``);
            yield queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`total_price\``);
        });
    }
}
exports.AddPriceForTripAndUbc1746828149133 = AddPriceForTripAndUbc1746828149133;
