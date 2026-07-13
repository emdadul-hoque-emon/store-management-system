import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DATABASE_CONNECTION } from '../database/constant';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { productSeed } from '../database/data/products';
import { QueryProductDto } from './dto/query-product.dto';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { SQL } from 'drizzle-orm';
import { and } from 'drizzle-orm';

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

  async findAll(query: QueryProductDto) {
    console.log(query);
    // await this.db.insert(schema.products).values(productSeed);
    const order =
      query?.order === 'asc'
        ? asc(schema.products[query.orderBy] || 'created_at')
        : desc(schema.products[query.orderBy] || 'created_at');

    const filters: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      filters.push(or(ilike(schema.products.name, `%${query.search}%`)));
    }
    const products = await this.db
      .select({
        id: schema.products.id,
        name: schema.products.name,
        price: schema.products.price,
        stock: schema.products.stock,
        barcode: schema.products.barcode,
        unit: {
          id: schema.units.id,
          name: schema.units.name,
          shortName: schema.units.shortName,
        },
      })
      .from(schema.products)
      .leftJoin(schema.units, eq(schema.units.id, schema.products.unitId))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
      .orderBy(order);

    const total = await this.db.$count(schema.products, ...filters);
    return {
      data: products,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
      },
    };
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
      .where(eq(schema.products.barcode, id))
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
