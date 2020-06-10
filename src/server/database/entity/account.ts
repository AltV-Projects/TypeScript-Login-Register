import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { AccountValidation } from "./accountValidation";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => AccountValidation)
  @JoinColumn()
  validation: AccountValidation;
}
