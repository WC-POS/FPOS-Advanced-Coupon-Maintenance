import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("AppState")
export class AppState {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
