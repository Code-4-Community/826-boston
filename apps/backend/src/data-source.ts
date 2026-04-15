import { DataSource } from 'typeorm';
import { PluralNamingStrategy } from './strategies/plural-naming.strategy';
import * as dotenv from 'dotenv';
import { Anthology } from './anthology/anthology.entity';
import { Author } from './author/author.entity';
import { Inventory } from './inventory/inventory.entity';
import { InventoryHolding } from './inventory-holding/inventory-holding.entity';
import { Story } from './story/story.entity';
import { Omchai } from './omchai/omchai.entity';
import { User } from './users/user.entity';
import { ProductionInfo } from './production-info/production-info.entity';
import { StoryDraft } from './story-draft/story-draft.entity';

dotenv.config({ path: 'apps/backend/.env' });
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.NX_DB_HOST,
  port: parseInt(process.env.NX_DB_PORT as string, 10),
  username: process.env.NX_DB_USERNAME,
  password: process.env.NX_DB_PASSWORD,
  database: process.env.NX_DB_DATABASE,
  entities: [
    Anthology,
    Author,
    Inventory,
    InventoryHolding,
    ProductionInfo,
    Story,
    Omchai,
    User,
    StoryDraft,
  ],
  migrations: ['apps/backend/src/migrations/*.ts'],
  // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data
  synchronize: false,
  namingStrategy: new PluralNamingStrategy(),
});

export default AppDataSource;
