import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity('child')
export class Child {
  @PrimaryGeneratedColumn()
  child_id: number;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column()
  age: number;

  @Column()
  school: string;

  @ManyToOne(() => User, (user) => user.children)
  user: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: string;
}