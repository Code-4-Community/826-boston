import { Author } from './author';
import { Genre } from './genre';
import { Theme } from './theme';

export interface Story {
  id: number;
  title: string;
  anthology_id: number;
  authors: Author[];
  genres?: Genre[];
  themes?: Theme[];
}
