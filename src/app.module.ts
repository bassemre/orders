import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './shared/config/database.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig().host,
      port: databaseConfig().port,
      username: databaseConfig().user,
      password: databaseConfig().password,
      database: databaseConfig().name,
      autoLoadEntities: true,
      synchronize: true,
      logger: 'simple-console',
    }),
    OrdersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
