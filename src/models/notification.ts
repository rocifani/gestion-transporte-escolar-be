import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column()
  title: string;

  @Column()
  detail: string;

  @Column({ type: "boolean", default: false })
    is_read: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: string;
}