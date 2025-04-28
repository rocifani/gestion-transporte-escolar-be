import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity("price")
export class Price {
  @PrimaryGeneratedColumn()
  price_id: number;

  @Column()
  monthly_price: number;

  @Column()
  daily_price: number;

  @Column({ type: "timestamp" })
  date_from: string;

  @ManyToOne(()=> User, (user)=> user.prices)
  @JoinColumn({ name: "user_id" })
  user: User[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: string;
}
