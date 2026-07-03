import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { UnitModule } from './modules/unit/unit.module';
import { CategoryModule } from './modules/category/category.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, ProductModule, UnitModule, CategoryModule, InvoiceModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
