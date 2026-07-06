import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
import { eq, inArray } from 'drizzle-orm';

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
      const [invoice] = await trx
        .insert(schema.invoices)
        .values({
          ...invoiceData,
          imageUrl,
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

  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
