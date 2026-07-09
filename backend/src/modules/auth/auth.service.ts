import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

import { DATABASE_CONNECTION } from '../database/constant';
import { JwtService } from '@nestjs/jwt';
import * as schema from '../database/schema';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.db.query.user.findFirst({
      where: (users) => eq(users.email, loginDto.email),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      storeId: user.storeId,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    if (!token) throw new BadRequestException('Token is required');
    const payload = await this.jwtService.verifyAsync(token);
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });
    return { accessToken, refreshToken };
  }

  async me(id: string) {
    const user = await this.db.query.user.findFirst({
      where: (users) => eq(users.id, id),
      columns: {
        password: false,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
      with: {
        store: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
