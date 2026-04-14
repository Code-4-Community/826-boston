import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryDraftController } from './story-draft.controller';
import { StoryDraft } from './story-draft.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AuthorModule } from '../author/author.module';
import { Author } from '../author/author.entity';
import { StoryDraftService } from './story-draft.service';
import { EditRound, SubmissionRound } from './types';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryDraft, Author]),
    AuthModule,
    UsersModule,
    AuthorModule,
  ],
  controllers: [StoryDraftController],
  providers: [StoryDraftService],
  exports: [StoryDraftService],
})
export class StoryDraftModule {}
