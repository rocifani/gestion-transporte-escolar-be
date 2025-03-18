import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./user";
  
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
  
    @Column({ type: "enum", enum: ["pending", "completed", "cancelled"], default: "pending" })
    status?: "pending" | "completed" | "cancelled";
  
    @CreateDateColumn()
    created_at?: Date;
  
    @UpdateDateColumn()
    updated_at?: Date;
  }
  