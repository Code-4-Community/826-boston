import { DataSource } from 'typeorm';
import { Story } from '../story/story.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { Author } from 'src/author/author.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';
import { StoriesSeed } from './stories.seed';
import { StoryDraftsSeed } from './story-drafts.seed';

export async function seedStories(dataSource: DataSource) {
  const storyRepo = dataSource.getRepository(Story);
  const anthologyRepo = dataSource.getRepository(Anthology);
  const authorRepo = dataSource.getRepository(Author);
  const draftRepo = dataSource.getRepository(StoryDraft);

  console.log('Seeding stories...');

  for (const { anthologyTitle, authorName, ...data } of StoriesSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { title: anthologyTitle },
    });

    if (!anthology) {
      console.log(
        `  - Anthology not found: "${anthologyTitle}", skipping story`,
      );
      continue;
    }

    const author = await authorRepo.findOne({ where: { name: authorName } });

    if (!author) {
      console.log(`  - Author not found: "${authorName}", skipping story`);
      continue;
    }

    const exists = await storyRepo.findOne({ where: { title: data.title } });

    if (!exists) {
      const draftSeedEntry = StoryDraftsSeed.find(
        (d) => d.storyTitle === data.title,
      );
      const storyDraft = draftSeedEntry
        ? await draftRepo.findOne({
            where: { docLink: draftSeedEntry.docLink },
          })
        : null;

      const entity = storyRepo.create({
        ...data,
        anthologyId: anthology.id,
        anthology,
        authorId: author.id,
        author,
        ...(storyDraft ? { storyDraft } : {}),
      });
      const savedStory = await storyRepo.save(entity);

      if (storyDraft) {
        storyDraft.story = savedStory;
        await draftRepo.save(storyDraft);
      }

      console.log(`  ✓ Created story: ${data.title}`);
    } else {
      console.log(`  - Story already exists: ${data.title}`);
    }
  }
}
