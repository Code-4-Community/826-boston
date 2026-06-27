import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionInfo } from './production-info.entity';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { Anthology } from '../anthology/anthology.entity';

@Injectable()
export class ProductionInfoService {
  constructor(
    @InjectRepository(ProductionInfo)
    private productionInfoRepository: Repository<ProductionInfo>,
    @InjectRepository(Anthology)
    private anthologyRepository: Repository<Anthology>,
  ) {}

  async create(
    createProductionInfoDto: CreateProductionInfoDto,
  ): Promise<ProductionInfo> {
    const anthology = await this.anthologyRepository.findOne({
      where: { id: createProductionInfoDto.anthology_id },
    });

    if (!anthology) {
      throw new NotFoundException(
        `Anthology with ID ${createProductionInfoDto.anthology_id} not found`,
      );
    }

    const productionInfo = this.productionInfoRepository.create({
      ...createProductionInfoDto,
    });

    return this.productionInfoRepository.save(productionInfo);
  }

  async findAll(): Promise<ProductionInfo[]> {
    return this.productionInfoRepository.find({ relations: ['anthology'] });
  }

  async findOneByAnthologyId(anthologyId: number): Promise<ProductionInfo> {
    const productionInfo = await this.productionInfoRepository.findOne({
      where: { anthology: { id: anthologyId } },
      relations: ['anthology'],
    });

    if (!productionInfo) {
      throw new NotFoundException(
        `Production info for anthology ID ${anthologyId} not found`,
      );
    }

    return productionInfo;
  }

  async update(
    id: number,
    updateProductionInfoDto: UpdateProductionInfoDto,
  ): Promise<ProductionInfo> {
    const productionInfo = await this.productionInfoRepository.findOne({
      where: { id },
      relations: ['anthology'],
    });

    if (!productionInfo) {
      throw new NotFoundException(`Production info with ID ${id} not found`);
    }

    if (updateProductionInfoDto.anthology_id) {
      const anthology = await this.anthologyRepository.findOne({
        where: { id: updateProductionInfoDto.anthology_id },
      });

      if (!anthology) {
        throw new NotFoundException(
          `Anthology with ID ${updateProductionInfoDto.anthology_id} not found`,
        );
      }
      productionInfo.anthology.id = anthology.id;
    }

    Object.assign(productionInfo, updateProductionInfoDto);

    return this.productionInfoRepository.save(productionInfo);
  }
}
