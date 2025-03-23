import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import bcrypt from "bcrypt";
import { Trip } from "./trip";
import { Vehicle } from "./vehicle";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  role_id: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column({ type: "date", nullable: true })
  birth_date?: string;

  @Column({type: "boolean", default: false})
  is_confirmed: boolean;

  @OneToMany(() => Trip, (trip) => trip.user)
    trips: Trip[];

  @OneToOne(() => Vehicle, (vehicle) => vehicle.user)
  vehicle: Vehicle;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
    }
}
