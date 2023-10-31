import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { TaskService } from '../task/task.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      UsersEntity
    ]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService, AuthService, LocalStrategy, JwtStrategy, JwtService, TaskService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
