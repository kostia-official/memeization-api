import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users.entity';

const PASSWORD_HASH_SALT = 13;

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      PASSWORD_HASH_SALT,
    );
  }
}
