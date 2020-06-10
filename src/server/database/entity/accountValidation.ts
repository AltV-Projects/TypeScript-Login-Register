import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AccountValidation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socialId: string;

  @Column()
  scNickname: string;

  @Column()
  licenseHash: string;

  @Column({ nullable: true })
  discordUserID: string;
}
