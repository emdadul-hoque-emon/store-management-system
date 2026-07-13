import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../database/schema';
import {
  CreateInvoiceDto,
  CreateInvoiceItem,
  CreateInvoiceItemDto,
} from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { DATABASE_CONNECTION } from '../database/constant';
import { uploadFileToCloudinary } from '../../common/utils/file-uploader';
import { desc, eq, inArray } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { QueryProductDto } from '../product/dto/query-product.dto';
import { asc } from 'drizzle-orm';
import { SQL } from 'drizzle-orm';
import { or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async create(dto: CreateInvoiceDto, image?: Express.Multer.File) {
    if (!image && (!dto.items || dto.items.length === 0)) {
      throw new BadRequestException(
        'Either invoice image or invoice items are required.',
      );
    }

    let imageUrl: string | null = null;

    if (image) {
      const uploaded = await uploadFileToCloudinary(image, 'invoice');
      imageUrl = uploaded?.url ?? null;
    }

    const { items = [], ...invoiceData } = dto;

    return this.db.transaction(async (trx) => {
      const lastInvoice = await trx.query.invoices.findFirst({
        where: and(eq(schema.invoices.storeId, dto.storeId)),
        orderBy: desc(schema.invoices.invoiceNo),
      });
      const nextInvoiceNo = (lastInvoice?.invoiceNo ?? 0) + 1;
      const [invoice] = await trx
        .insert(schema.invoices)
        .values({
          ...invoiceData,
          imageUrl,
          invoiceNo: nextInvoiceNo,
        })
        .returning();

      if (items.length > 0) {
        // Get all product ids
        const productIds = [...new Set(items.map((item) => item.productId))];

        // Fetch all products in one query
        const products = await trx.query.products.findMany({
          where: (product) => inArray(product.id, productIds),
          columns: {
            id: true,
            stock: true,
            price: true,
          },
        });

        // Create a lookup map
        const productMap = new Map(products.map((p) => [p.id, p]));

        const invoiceItems: CreateInvoiceItem[] = [];
        const stockUpdates: { id: string; newStock: number }[] = [];

        for (const item of items) {
          const product = productMap.get(item.productId);

          if (!product) {
            throw new BadRequestException(
              `Product with id ${item.productId} not found`,
            );
          }

          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.productId}`,
            );
          }

          invoiceItems.push({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price.toString(),
            total: (Number(product.price) * item.quantity).toString(),
          });

          stockUpdates.push({
            id: product.id,
            newStock: product.stock - item.quantity,
          });
        }

        // Insert all invoice items
        await trx.insert(schema.invoiceItems).values(invoiceItems);

        // Update product stocks
        for (const stock of stockUpdates) {
          await trx
            .update(schema.products)
            .set({ stock: stock.newStock })
            .where(eq(schema.products.id, stock.id));
        }
      }

      return invoice;
    });
  }

  async findAll(query: QueryProductDto, storeId: string) {
    const order =
      query?.order === 'asc'
        ? asc(schema.invoices[query.orderBy] || 'created_at')
        : desc(schema.invoices[query.orderBy] || 'created_at');

    const filters: (SQL<unknown> | undefined)[] = [];
    filters.push(eq(schema.invoices.storeId, storeId));

    if (query.search) {
      filters.push(
        or(
          ilike(schema.invoices.customerName, `%${query.search}%`),
          ilike(schema.invoices.customerPhone, `%${query.search}%`),
        ),
      );
    }

    const invoices = await this.db
      .select()
      .from(schema.invoices)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
      .orderBy(order);

    const count = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.invoices)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .then((res) => res[0].count);

    return {
      data: invoices,
      meta: {
        total: count,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async findOne(id: string) {
    const invoice = await this.db.query.invoices.findFirst({
      where: eq(schema.invoices.id, id),
      with: {
        items: {
          with: {
            product: {
              columns: {
                name: true,
                barcode: true,
              },
            },
          },
          columns: {
            id: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return invoice;
  }
  async findOneItems(id: string) {
    // const invoice = await this.db.query.invoices.findFirst({
    //   where: eq(schema.invoices.id, id),
    //   with: {
    //     items: {
    //       with: {
    //         product: {
    //           columns: {
    //             name: true,
    //             barcode: true,
    //           },
    //         },
    //       },
    //       columns: {
    //         id: true,
    //         quantity: true,
    //         price: true,
    //         total: true,
    //       },
    //     },
    //   },
    // });

    // if (!invoice) {
    //   throw new NotFoundException(`Invoice with id ${id} not found`);
    // }
    // return invoice;
    const items = await this.db.query.invoiceItems.findMany({
      where: eq(schema.invoiceItems.invoiceId, id),
      with: {
        product: {
          columns: {
            name: true,
            barcode: true,
          },
        },
      },
      columns: {
        id: true,
        quantity: true,
        price: true,
        total: true,
      },
    });

    return items;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
