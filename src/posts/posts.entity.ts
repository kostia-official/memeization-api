import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'simple-array', default: '' })
  likes: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamptz', readonly: true })
  public createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', readonly: true })
  public updatedDate: Date;
}
