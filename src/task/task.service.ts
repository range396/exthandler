import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { UsersEntity } from '../users/users.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService implements OnModuleInit {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: MongoRepository<UsersEntity>,
  ){}

  onModuleInit() {
    let now = new Date().getTime();
    cron.schedule('*/1 * * * *', async () => {
      let users = await this.usersRepository.find({});
      let one_week = (60 * 60 * 1000) * 168; // 1 week
      let one_hour = 60 * 60 * 1000;
      if(users) {
        users.forEach(async (item) => {
          let from = new Date(item.creditUpdated).getTime();
          // console.log(item.email+'  One week comparison', (from+one_week) <= now );
          // console.log('From ', from);
          // console.log('Today...', now );
          if(now >= from && (from+one_hour) <= now ) {
            await this.usersRepository.update({ email: item.email, id: item.id }, {
              credits: 0,
            });
          }
        });
      }


    });
  }

}
