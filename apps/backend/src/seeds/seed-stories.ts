import { DataSource } from 'typeorm';
import { Story } from '../story/story.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';
import { StoriesSeed } from './stories.seed';
import { SubmissionRound, EditRound } from 'src/story-draft/types';

export async function seedStories(dataSource: DataSource) {
  const storyRepo = dataSource.getRepository(Story);
  const anthologyRepo = dataSource.getRepository(Anthology);
  const authorRepo = dataSource.getRepository(Author);
  const draftRepo = dataSource.getRepository(StoryDraft);

  console.log('Seeding stories...');

  for (const { anthology_id, author_id, ...data } of StoriesSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { id: anthology_id },
    });

    if (!anthology) {
      console.log(`  - Anthology not found: "${anthology_id}", skipping story`);
      continue;
    }

    const author = await authorRepo.findOne({ where: { id: author_id } });

    if (!author) {
      console.log(`  - Author not found: "${author_id}", skipping story`);
      continue;
    }

    const storyExists = await storyRepo.findOne({
      where: { title: data.title },
    });

    if (!storyExists) {
      // create story first
      const storyEntity = storyRepo.create({
        ...data,
        anthology,
        author,
      });

      await storyRepo.save(storyEntity);
      console.log(`  ✓ Created story: ${data.title}`);

      // create draft if needed
      if (data.story_draft_id) {
        const draftExists = await draftRepo.findOne({
          where: { id: data.story_draft_id },
        });

        if (!draftExists) {
          const draftEntity = draftRepo.create({
            id: data.story_draft_id,
            story: { id: storyEntity.id },
            docLink: 'http://docs.google.com',
            submissionRound: SubmissionRound.ONE,
            studentConsent: false,
            inManuscript: false,
            editRound: EditRound.ONE,
            proofread: false,
            notes: [],
          });

          await draftRepo.save(draftEntity);
          console.log(`  ✓ Created story draft for story: "${data.title}"`);

          // update story
          storyEntity.storyDraft = draftEntity;
          await storyRepo.save(storyEntity);
        }
      }
    } else {
      console.log(`  - Story already exists: ${data.title}`);
    }
  }
}
