import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { TripChild } from "./trip_child";

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
  school_name: string;

  @Column()
  school_address: string;

  @Column()
  school_shift: string; 

  @ManyToOne(() => User, (user) => user.children)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => TripChild, (trip_child) => trip_child.child)
  trip_children: TripChild[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: string;
}