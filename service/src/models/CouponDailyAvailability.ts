import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Max, Min } from "class-validator";

import { CouponRule } from "./CouponRule";

@Entity("CouponDailyAvailability")
export class CouponDailyAvailability {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  isActive!: boolean;

  @Column()
  @Min(0)
  @Max(6)
  dayIndex!: number;

  @Column()
  @Min(0)
  @Max(23)
  startHour!: number;

  @Column()
  @Min(0)
  @Max(59)
  startMinute!: number;

  @Column()
  @Min(0)
  @Max(23)
  endHour!: number;

  @Column()
  @Min(0)
  @Max(59)
  endMinute!: number;

  @ManyToOne(() => CouponRule, (couponRule) => couponRule.dailyAvailability)
  couponRule!: CouponRule;
}
