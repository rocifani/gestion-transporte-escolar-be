import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn} from "typeorm";
import { User } from "./user";
import { Trip } from "./trip";

@Entity("vehicle")
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicle_id: number;

  @Column()
  make: string; 

  @Column()
  model: string; 

  @Column()
  year: number; 

  @Column({ unique: true })
  licensePlate: string; 

  @Column({})
  capacity: number;

  @Column({ nullable: true })
  authorization_pdf?: string; 

  @OneToOne(() => User, (user) => user.vehicle)
  @JoinColumn({ name: "userId" }) 
  user: User;

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;
}
