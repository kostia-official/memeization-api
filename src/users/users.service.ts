import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(user: Partial<User>): Promise<User> {
    const userRecord = this.usersRepository.create(user);
    return this.usersRepository.save(userRecord);
  }

  findOne(where: FindConditions<User>): Promise<User> {
    return this.usersRepository.findOne(where);
  }
}
