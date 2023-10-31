import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../users/users.entity';

import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtService,
  ){}

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    console.log("user=======", password, user.password);
    console.log("user=======", user);
    const compared = await bcrypt.compare(password, user.password);
    if (user && compared) {
      const {password, ...result} = user;
      return { ...result, id: user.id.toString(), password: user.password };
    }
    return null;
  }

  async loginWithCredentials(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: await this.jwtTokenService.sign(payload),
    };
  }
}