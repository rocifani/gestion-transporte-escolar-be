import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity("users") // Nombre de la tabla en MySQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
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

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column({ type: "date", nullable: true })
  birth_date?: string;

  
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

}
