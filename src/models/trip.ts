import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Authorization } from "./authorization";
import { TripChild } from "./trip_child";

  @Entity('trip')
  export class Trip {
    @PrimaryGeneratedColumn()
    trip_id: number;
  
    @Column({ type: "date", nullable: true })
    date?: string;

    @Column()
    available_capacity: number;
  
    @Column({ type: "enum", enum: ["pending","in progress", "completed", "cancelled"], default: "pending" })
    status?: "pending" | "in progress" | "completed" | "cancelled";

    @ManyToOne(() => Authorization, (authorization) => authorization.trips)
    @JoinColumn({ name: "authorization_id" })
    authorization: Authorization;

    @OneToMany(() => TripChild, (trip_child) => trip_child.trip)
    trip_child: TripChild[];

    @Column({nullable: true })
    total_price: number;

    @Column({default: false})
    is_paid: boolean;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: string;
    trip_children: any;
  }
  