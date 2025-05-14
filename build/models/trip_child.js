"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripChild = void 0;
const typeorm_1 = require("typeorm");
const trip_1 = require("./trip");
const child_1 = require("./child");
let TripChild = class TripChild {
};
exports.TripChild = TripChild;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TripChild.prototype, "trip_child_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => child_1.Child, (child) => child.trip_children),
    (0, typeorm_1.JoinColumn)({ name: "child_id" }),
    __metadata("design:type", child_1.Child)
], TripChild.prototype, "child", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trip_1.Trip, (trip) => trip.trip_children),
    (0, typeorm_1.JoinColumn)({ name: "trip_id" }),
    __metadata("design:type", trip_1.Trip)
], TripChild.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], TripChild.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], TripChild.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", String)
], TripChild.prototype, "deleted_at", void 0);
exports.TripChild = TripChild = __decorate([
    (0, typeorm_1.Entity)('trip_child')
], TripChild);
