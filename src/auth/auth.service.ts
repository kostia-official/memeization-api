import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import { User } from '../users/users.entity';

export interface IAuthResponse {
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    return _.omit(user, 'password');
  }

  async signIn(user: User): Promise<IAuthResponse> {
    const payload = { email: user.email, sub: user.id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp(user: Partial<User>): Promise<IAuthResponse> {
    const userRecord = await this.usersService.create(user);
    const payload = { email: userRecord.email, sub: userRecord.id };

    return {
      user: userRecord,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
