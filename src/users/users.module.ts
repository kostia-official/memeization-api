import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersSubscriber } from './users.subscriber';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule,  TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersSubscriber],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
