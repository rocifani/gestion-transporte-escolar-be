import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import { Trip } from "./trip";

@Entity("authorization")
export class Authorization {
  @PrimaryGeneratedColumn()
  authorization_id: number;

  @Column()
  driver_name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column()
  school: string;

  @Column()
  work_shift: string;

  @Column()
  vehicle_make: string;

  @Column()
  vehicle_model: string;

  @Column()
  vehicle_year: number;

  @Column({ unique: true })
  vehicle_license_plate: string;

  @Column()
  vehicle_capacity: number;

  @Column({ nullable: true })
  vehicle_authorization_pdf?: string;

  @Column({ nullable: true })
  driver_authorization_pdf?: string;

  @Column({ type: "date"})
  due_date_vehicle: string;

  @Column({ type: "date"})
  due_date_driver: string;

  @Column({})
  state: number;

  @ManyToOne(() => User, (user) => user.authorizations)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(()=> Trip, (trip)=> trip.authorization)
  trips: Trip[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;
}
