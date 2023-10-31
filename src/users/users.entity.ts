import { Entity, ObjectId, ObjectIdColumn, Column, Unique, Index } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from "class-validator";


@Entity({ name: 'users' })
export class UsersEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  name: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: false })
  refreshToken?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ type: 'int',  nullable: true })
  expires?: number;

  @Column({ default: 10, type: 'int', nullable: false })
  credits: number;

  @Column({ type: 'datetime', nullable: false })
  creditUpdated: Date;

  @Column({ nullable: false, default: new Date() })
  created_at?: Date;

  constructor(user?: Partial<UsersEntity>) {
    Object.assign(this, user);
  }
}
