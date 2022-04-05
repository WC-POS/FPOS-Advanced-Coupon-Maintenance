import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CouponDailyAvailability } from './CouponDailyAvailability';
import { CouponItem } from './CouponItem';
import { Min } from 'class-validator';

@Entity()
export class CouponRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('nvarchar')
  name!: string;

  @Column('nvarchar')
  receiptName!: string;

  @Column()
  isActive!: boolean;

  @Column('smallint', { default: -1 })
  @Min(-1)
  maxApplications!: number;

  @Column()
  isDiscountExclusive!: boolean;

  @Column('nvarchar')
  notes!: string;

  @Column('date')
  startDate!: Date;

  @Column('date')
  endDate!: Date;

  @OneToMany(
    () => CouponDailyAvailability,
    (couponDailyAvailability) => couponDailyAvailability.couponRule
  )
  dailyAvailability!: CouponDailyAvailability[];

  @OneToMany(() => CouponItem, (couponItem) => couponItem.couponRule)
  items!: CouponItem[];
}
