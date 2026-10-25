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
    const { anthology_id, ...productionInfoFields } = createProductionInfoDto;

    const anthology = await this.anthologyRepository.findOne({
      where: { id: anthology_id },
    });

    if (!anthology) {
      throw new NotFoundException(
        `Anthology with ID ${anthology_id} not found`,
      );
    }

    const productionInfo = await this.productionInfoRepository.save(
      this.productionInfoRepository.create(productionInfoFields),
    );

    // ProductionInfo is the inverse side of this relation. Anthology owns the
    // foreign key column, so the link is only persisted by saving the anthology.
    anthology.productionInfo = productionInfo;
    await this.anthologyRepository.save(anthology);

    return productionInfo;
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

    const { anthology_id, ...productionInfoFields } = updateProductionInfoDto;

    if (anthology_id) {
      const newAnthology = await this.anthologyRepository.findOne({
        where: { id: anthology_id },
      });

      if (!newAnthology) {
        throw new NotFoundException(
          `Anthology with ID ${anthology_id} not found`,
        );
      }

      const previousAnthology = productionInfo.anthology;
      if (previousAnthology && previousAnthology.id !== newAnthology.id) {
        previousAnthology.productionInfo = null;
        await this.anthologyRepository.save(previousAnthology);
      }

      newAnthology.productionInfo = productionInfo;
      await this.anthologyRepository.save(newAnthology);
      productionInfo.anthology = newAnthology;
    }

    Object.assign(productionInfo, productionInfoFields);

    return this.productionInfoRepository.save(productionInfo);
  }
}
