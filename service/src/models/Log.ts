import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IsIn } from "class-validator";

@Entity("Log")
export class Log {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("nvarchar")
  fposSaleId!: string;

  @Column("nvarchar")
  fposSaleItemId!: string;

  @Column("uuid")
  rule!: string;

  @Column("uuid")
  ruleItem!: string;

  @Column("smallint")
  originalPrice!: number;

  @Column("smallint")
  alteredPrice!: number;

  @Column("nvarchar")
  @IsIn(["discount-flat", "discount-percent", "price-change", "price-increase"])
  operation!: string;

  @Column("smallint")
  operationAmount!: number;

  @Column("nvarchar")
  @CreateDateColumn()
  createdAt!: Date;
}
