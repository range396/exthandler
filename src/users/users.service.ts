import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UsersEntity } from './users.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: MongoRepository<UsersEntity>,
  ){}

  async getUsers(): Promise<UsersEntity[] | any> {
    return this.usersRepository.find({});
  }

  async createUser(data, authService): Promise<UsersEntity[] | any> {
    try {

      const user = await this.usersRepository.find({email: data.email});
      if(user.length !== 0)
        return "Account exists, try different email";
      let oldPass = data.password;
      data.password = await bcrypt.hash(oldPass, 10);
      const newUser = await this.usersRepository.save({
        ...data,
        credits: 10,
        created_at: new Date(),
        creditUpdated: new Date()
      });

      let credentials = {
        id: newUser.id,
        email: data.email,
        password: oldPass,
      };

      const access_token = await this.signInUser(credentials, authService);

      // console.log(access_token.access_token);
      const final = await this.usersRepository.update({email: newUser.email},{
        accessToken: access_token.access_token,
        expires: Number(process.env.JWT_EXPIRES),
      }).then(user => JSON.stringify(user)).catch((e) => "error With update:: " +  e);

      const lastUser = await this.usersRepository.findOne({ where: { email: data.email } });

      return {
        access_token: access_token.access_token,
        id: lastUser.id,
        expires: lastUser.expires,
        creditUpdated: lastUser.creditUpdated
      };

    } catch(err) {
      console.log("****** "+ err);
      return null;
    }
  }

  private async signInUser(credentials, authService): Promise<any> {
    const validUser = await authService.validateUserCredentials(credentials.email, credentials.password);
    console.log('Valid User-- ', validUser);
    if(!validUser)
      return validUser;

    // return authService.validateUserCredentials(credentials.email, credentials.password);;
    const user = { email: validUser.email, userId: credentials.password }; // password credentials.id.toString()
    return authService.loginWithCredentials(user);

  }


  async findOne(email) {
    const foundUser = await this.usersRepository.find({email: email});

    console.log("FindONe:  ", foundUser );
    // const user = await service.find({ where: { email: email } });
    if(foundUser) {
      return {
        id: foundUser[0].id.toString(),
        email: foundUser[0].email,
        password: foundUser[0].password
      };
    }
    return null;

  }

  async logInUser(user, password, authService) {
    const validUser = await authService.validateUserCredentials(user.email, password);
    console.log(validUser, '/////////////////');
    if(validUser) {
      const token = await authService.loginWithCredentials(user);
      const logedInUser = await this.usersRepository.update({
        email: user.email
      },{
        accessToken: token.access_token,
        expires: Number(process.env.JWT_EXPIRES)
      });
      console.log(logedInUser, "*-*-*-*-*-*-*");
      return {
        email: user.email,
        id: validUser.id.toString(),
        access_token: token.access_token
      };
    }
    return "Credentials is invalid";
  }

}
