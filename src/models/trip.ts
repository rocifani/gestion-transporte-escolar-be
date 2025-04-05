import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
  import { User } from "./user";
import { Authorization } from "./authorization";
import { Child } from "./child";
  
  @Entity('trip')
  export class Trip {
    @PrimaryGeneratedColumn()
    trip_id: number;
  
    @ManyToOne(() => User, (user) => user.trips)
    user: User;
  
    @Column()
    school: string;
  
    @Column({ type: "date", nullable: true })
    date?: string;

    @Column({ type: "time", nullable: true })
    time?: string;
  
    @Column({ type: "enum", enum: ["pending", "completed", "cancelled"], default: "pending" })
    status?: "pending" | "completed" | "cancelled";

    @ManyToOne(() => Authorization, (authorization) => authorization.trips)
    vehicle: Authorization;

    @ManyToOne(() => Child, (child) => child.trip)
    children: Child;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: string;
  }
  