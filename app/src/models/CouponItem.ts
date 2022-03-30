import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CouponRule } from "./CouponRule";
import { IsIn } from "class-validator";

@Entity()
export class CouponItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  itemName!: string;

  @Column()
  @IsIn(["discount-flat", "discount-percent", "price-change", "price-increase"])
  operation!: string;

  @Column()
  amount!: number;

  @Column({ type: Boolean, default: false })
  isRequired!: boolean;

  @ManyToOne(() => CouponRule, (couponRule) => couponRule.items)
  couponRule!: CouponRule;
}
