import {
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('integer', { default: 0 })
  total_price: number;

  @Column({ type: 'simple-json' })
  products: {
    id: string;
    quantity: number;
  };
  @Column({
    enum: ['pending', 'failed', 'succeeded'],
    default: 'pending',
  })
  status: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
