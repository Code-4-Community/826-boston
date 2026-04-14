import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Anthology]), AuthModule, UsersModule],
  controllers: [AnthologyController],
  providers: [AnthologyService],
  exports: [AnthologyService],
})
export class AnthologyModule {}
