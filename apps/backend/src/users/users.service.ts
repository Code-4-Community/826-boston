import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './types';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(
    email: string,
    firstName: string,
    lastName: string,
    role: Role = Role.STANDARD,
    title?: string,
  ) {
    const latestUser = await this.repo.find({
      select: ['id'],
      order: { id: 'DESC' },
      take: 1,
    });

    const userId = latestUser.length > 0 ? Number(latestUser[0].id) : 1;

    const user = this.repo.create({
      id: userId,
      role,
      firstName,
      lastName,
      email,
      title,
    });

    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findWithOmchai(email: string) {
    return this.repo.find({
      where: { email },
      relations: { omchaiAssignments: true },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
