import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Trip } from "./trip";
import { Child } from "./child";

@Entity('trip_child')
export class TripChild {
  @PrimaryGeneratedColumn()
  trip_child_id: number;

  @ManyToOne(() => Child, (child) => child.trip_children)
  @JoinColumn({ name: "child_id" })
  child: Child;

  @ManyToOne(() => Trip, (trip) => trip.trip_children)
  @JoinColumn({ name: "trip_id" })
  trip: Trip;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: string;
}