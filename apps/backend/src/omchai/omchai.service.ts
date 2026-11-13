import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Omchai } from './omchai.entity';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';

@Injectable()
export class OmchaiService {
  constructor(@InjectRepository(Omchai) private repo: Repository<Omchai>) {}

  async create(createOmchaiDto: CreateOmchaiDto) {
    const omchai = this.repo.create(createOmchaiDto);
    return this.repo.save(omchai);
  }

  async createMany(
    createOmchaiDtos: CreateOmchaiDto[],
    transactionManager?: EntityManager,
  ) {
    const targetRepo = transactionManager
      ? transactionManager.getRepository(Omchai)
      : this.repo;

    const omchais = createOmchaiDtos.map((dto) =>
      targetRepo.create({
        anthology: { id: dto.anthologyId },
        user: { id: dto.userId },
        role: dto.role,
        datetimeAssigned: dto.datetimeAssigned,
      }),
    );
    return targetRepo.save(omchais);
  }

  findAll() {
    return this.repo.find();
  }

  findByAnthologyId(anthologyId: number) {
    return this.repo.find({
      where: { anthology: { id: anthologyId } },
      relations: ['user'],
    });
  }

  async update(id: number, updateOmchaiDto: EditOmchaiDto) {
    const omchai = await this.repo.findOneBy({ id });

    if (!omchai) {
      throw new NotFoundException('Omchai not found');
    }

    Object.assign(omchai, updateOmchaiDto);
    return this.repo.save(omchai);
  }
}
