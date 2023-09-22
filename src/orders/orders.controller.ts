import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @MessagePattern('get-orders-by-user')
  async getOrdersByUser(user_id: string) {
    return this.ordersService.getOrdersByUser(user_id);
  }
  @MessagePattern('show-user-order')
  show({ id, user_id }: { id: string; user_id: string }) {
    return this.ordersService.findByIdAndUserId(id, user_id);
  }
  @MessagePattern('destroy-order-by-id')
  async destroy({ id, user_id }: { id: string; user_id: string }) {
    return this.ordersService.destroy({ id, user_id });
  }
  @MessagePattern('create_order')
  async store(data: any) {
    return this.ordersService.create(data);
  }
  @EventPattern('order_charged')
  markOrderStatus({ id, status }) {
    return this.ordersService.markOrderStatus(id, status);
  }
}
