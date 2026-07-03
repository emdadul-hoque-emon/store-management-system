import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { NodePgClient, NodePgDatabase } from 'drizzle-orm/node-postgres';
// import { JwtService } from '@nestjs/jwt';
import * as schema from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DATABASE_CONNECTION } from '../database/constant';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    // private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const isExists = await this.db.query.user.findFirst({
      where: eq(schema.user.phone, createUserDto.phone),
    });
    if (isExists) throw new ConflictException('User already exists');

    return await this.db.insert(schema.user).values(createUserDto).returning();
  }

  findAll() {
    return `This action returns all user`;
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
