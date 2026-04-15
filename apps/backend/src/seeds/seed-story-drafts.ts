import { Anthology } from 'src/anthology/anthology.entity';
import { StoryDraft } from 'src/story-draft/story-draft.entity';
import { DataSource } from 'typeorm';
import { StoryDraftsSeed } from './story-drafts.seed';

export async function seedStoryDrafts(dataSource: DataSource) {
  const draftRepo = dataSource.getRepository(StoryDraft);
  const anthologyRepo = dataSource.getRepository(Anthology);

  console.log('Seeding story drafts...');

  for (const { storyTitle, anthologyTitle, ...data } of StoryDraftsSeed) {
    const anthology = await anthologyRepo.findOne({
      where: { title: anthologyTitle },
    });

    if (!anthology) {
      console.warn(
        `  ✗ Anthology not found for story draft: "${anthologyTitle}"`,
      );
      continue;
    }

    const exists = await draftRepo.findOne({
      where: { docLink: data.docLink },
    });

    if (!exists) {
      const entity = draftRepo.create({ ...data, anthologyId: anthology.id });
      await draftRepo.save(entity);
      console.log(`  ✓ Created story draft for: "${storyTitle}"`);
    } else {
      console.log(`  - Story draft already exists for: "${storyTitle}"`);
    }
  }
}
