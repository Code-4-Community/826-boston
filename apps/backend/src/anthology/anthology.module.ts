import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OmchaiService } from 'src/omchai/omchai.service';
import { OmchaiModule } from 'src/omchai/omchai.module';
import { AwsS3Module } from '../aws/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anthology]),
    AuthModule,
    UsersModule,
    OmchaiModule,
    AwsS3Module,
  ],
  controllers: [AnthologyController],
  providers: [AnthologyService],
  exports: [AnthologyService],
})
export class AnthologyModule {}
