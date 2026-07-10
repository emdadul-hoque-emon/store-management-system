import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { DATABASE_CONNECTION } from '../database/constant';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';
import { or } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StoreService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createStoreDto: CreateStoreDto) {
    console.log(createStoreDto);
    const isExists = await this.db.query.store.findFirst({
      where: or(
        eq(schema.store.name, createStoreDto.store_name),
        eq(schema.store.email, createStoreDto.store_email),
        eq(schema.store.phone, createStoreDto.store_phone),
      ),
    });

    if (isExists) throw new ConflictException('Store already exists');

    const res = await this.db.transaction(async (tx) => {
      const store = await tx
        .insert(schema.store)
        .values({
          name: createStoreDto.store_name,
          email: createStoreDto.store_email,
          phone: createStoreDto.store_phone,
          address: createStoreDto.store_address,
        })
        .returning()
        .then((store) => store[0]);

      const hasedPassword = await bcrypt.hash(
        createStoreDto?.password ?? 'admin',
        10,
      );
      const user = await tx
        .insert(schema.user)
        .values({
          name: createStoreDto.name as string,
          phone: createStoreDto.store_phone,
          email: createStoreDto.store_email,
          storeId: store.id,
          password: hasedPassword,
          role: 'admin',
        })
        .returning({
          id: schema.user.id,
          role: schema.user.role,
          name: schema.user.name,
          phone: schema.user.phone,
          email: schema.user.email,
          storeId: schema.user.storeId,
        })
        .then((user) => user[0]);

      return { store, user };
    });

    const payload = {
      email: res.user.email,
      sub: res.user.id,
      role: res.user.role,
      storeId: res.user.storeId,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    return { accessToken, refreshToken };
  }

  async findAll() {
    return await this.db.query.store.findMany();
  }

  async findOne(id: string) {
    const store = await this.db.query.store.findFirst({
      where: eq(schema.store.id, id),
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
