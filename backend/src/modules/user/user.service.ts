import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
import * as schema from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DATABASE_CONNECTION } from '../database/constant';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    // private readonly jwtService: JwtService,
  ) {}
  async create({ password, ...createUserDto }: CreateUserDto) {
    const isExists = await this.db.query.user.findFirst({
      where: eq(schema.user.phone, createUserDto.phone),
    });
    if (isExists) throw new ConflictException('User already exists');

    const hasedPassword = await bcrypt.hash(password, 10);

    const [{ password: pass, ...user }] = await this.db
      .insert(schema.user)
      .values({
        ...createUserDto,
        password: hasedPassword,
      })
      .returning();

    return user;
  }

  async findAll() {
    return this.db.query.user.findMany({
      columns: {
        password: false,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
