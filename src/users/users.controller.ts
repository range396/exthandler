import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { MongoRepository } from 'typeorm';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { toArray } from 'rxjs/operators';

@Controller('users')
export class UsersController {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: MongoRepository<UsersEntity>,
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {
  }

  @Get('')
  async users() {
    return await this.usersService.getUsers();
  }

  @Post('sign-up')
  async signUpUser(
    @Body('name') name,
    @Body('email') email,
    @Body('password') password
  ) {

    const credentials = {name, email, password};
    return await this.usersService.createUser( credentials, this.authService );
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req,
    @Body('password') password
  ) {
    console.log("User from request " + JSON.stringify(req.user));
    return this.usersService.logInUser(req.user, password,  this.authService);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  getUserInfo(@Request() req) {
    return req.user
  }

}
