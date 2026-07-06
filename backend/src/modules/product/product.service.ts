import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DATABASE_CONNECTION } from '../database/constant';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  create(createProductDto: CreateProductDto) {
    const product = this.db
      .insert(schema.products)
      .values(createProductDto)
      .returning();
    return product;
  }

  async findAll() {
    const products = await this.db
      .select({
        id: schema.products.id,
        name: schema.products.name,
        price: schema.products.price,
        stock: schema.products.stock,
        barcode: schema.products.barcode,
        unit: {
          name: schema.units.name,
          shortName: schema.units.shortName,
        },
      })
      .from(schema.products)
      .leftJoin(schema.units, eq(schema.units.id, schema.products.unitId));
    return products;
  }

  async findOne(id: string) {
    return await this.db
      .select({
        id: schema.products.id,
        name: schema.products.name,
        price: schema.products.price,
        stock: schema.products.stock,
        barcode: schema.products.barcode,
        unit: {
          name: schema.units.name,
          shortName: schema.units.shortName,
        },
      })
      .from(schema.products)
      .leftJoin(schema.units, eq(schema.units.id, schema.products.unitId))
      .where(eq(schema.products.id, id))
      .then((res) => {
        return res[0];
      })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException('Product not found');
      });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    return await this.db
      .delete(schema.products)
      .where(eq(schema.products.id, id));
  }
}
