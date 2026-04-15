import AppDataSource from 'src/data-source';
import { seedAnthologies } from './seed-anthologies';
import { seedAuthors } from './seed-authors';
import { seedInventories } from './seed-inventories';
import { seedInventoryHoldings } from './seed-inventory-holdings';
import { seedOmchais } from './seed-omchai';
import { seedStories } from './seed-stories';
import { seedStoryDrafts } from './seed-story-drafts';
import { seedUsers } from './seed-users';

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established.');

    console.log('Starting seed process...');

    await seedUsers(AppDataSource);
    console.log('Users seeded successfully.');

    await seedAnthologies(AppDataSource);
    console.log('Anthologies (with ProductionInfo) seeded successfully.');

    await seedInventories(AppDataSource);
    console.log('Inventories seeded successfully.');

    await seedInventoryHoldings(AppDataSource);
    console.log('Inventory holdings seeded successfully.');

    await seedOmchais(AppDataSource);
    console.log('Omchais seeded successfully.');

    await seedAuthors(AppDataSource);
    console.log('Authors seeded successfully.');

    await seedStoryDrafts(AppDataSource);
    console.log('Story drafts seeded successfully.');

    await seedStories(AppDataSource);
    console.log('Stories seeded successfully.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

runSeeds();
