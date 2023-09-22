import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
  ) {}
  async getOrdersByUser(user_id: string): Promise<OrderEntity[]> {
    return await this.ordersRepo.find({ where: { user_id } });
  }
  async markOrderStatus(id, status) {
    return this.ordersRepo.update(id, {
      status,
    });
  }
  async findByIdAndUserId(id, user_id) {
    return this.ordersRepo.findOneOrFail({ where: { id, user_id } });
  }
  async create({ products, user_id }): Promise<OrderEntity> {
    const INITIAL_VALUE = 0;
    const total_price = products.reduce(
      (accumulator, product) =>
        accumulator + product.ordered_quantity * product.price,
      INITIAL_VALUE,
    );
    const databaseProducts = products.map((product) => {
      return { id: product.id, quantity: product.ordered_quantity };
    });
    const actualProducts = products.map((product) => {
      product.quantity = product.quantity - product.ordered_quantity;
      delete product.ordered_quantity;
      return { ...product };
    });
    products = databaseProducts;

    const order = await this.ordersRepo.create({
      products,
      user_id,
      total_price,
    });
    await this.ordersRepo.save(order);
    order.products = actualProducts;
    return order;
  }
  async destroy({ id, user_id }) {
    // find the order.
    const order = await this.ordersRepo.findOne({
      where: { id, user_id },
    });
    if (!order) {
      throw new HttpException(
        'you dont has permession to delete this order ',
        HttpStatus.FORBIDDEN,
      );
    } else {
      await this.ordersRepo.delete({ id, user_id });
      // return the order to fire an event increasing the stock of related products to this order at the gateway.
      return order;
    }
  }
}
