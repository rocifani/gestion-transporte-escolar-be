import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import { Authorization } from "./authorization";
import { Child } from "./child";
import { Price } from "./price";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dni: string;

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

  @OneToMany(()=> Authorization, (authorization)=> authorization.user)
  authorizations: Authorization[];

  @OneToMany(() => Child, (child) => child.user)
  children: Child[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @OneToMany(() => Price, (price) => price.user)
  prices: Price[];

async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
    }
}
