import { Anthology, AnthologyStatus } from './anthology';
import { Genre } from './genre';
import { InventoryLocation } from './inventory-location';
import { Theme } from './theme';

export class Library {
  anthologies: Anthology[];

  constructor(anthologies: Anthology[]) {
    this.anthologies = anthologies;
  }

  getById(id: number): Anthology | undefined {
    return this.anthologies.find((anthology) => anthology.id === id);
  }

  filterByGenreId(id: number): Anthology[] {
    const anthologies = this.anthologies.filter((anthology) =>
      anthology.getGenres().filter((genre) => genre.id === id),
    );

    return anthologies;
  }

  filterByThemeId(id: number): Anthology[] {
    const anthologies = this.anthologies.filter((anthology) =>
      anthology.getThemes().filter((theme) => theme.id === id),
    );

    return anthologies;
  }

  filterByAuthorId(id: number): Anthology[] {
    const anthologies = this.anthologies.filter((anthology) =>
      anthology.getAuthors().filter((author) => author.id === id),
    );

    return anthologies;
  }

  filterByInventoryId(id: number): Anthology[] {
    const anthologies = this.anthologies.filter((anthology) =>
      anthology.inventory_locations?.filter((inventory) => inventory.id === id),
    );

    return anthologies;
  }

  filterByYear(year: number): Anthology[] {
    const anthologies = this.anthologies.filter(
      (anthology) => anthology.published_year === year,
    );

    return anthologies;
  }

  filterByStatus(status: AnthologyStatus): Anthology[] {
    const anthologies = this.anthologies.filter(
      (anthology) => anthology.status === status,
    );

    return anthologies;
  }

  getAllGenres(): Set<Genre> {
    const genres = new Set<Genre>();
    this.anthologies.forEach((anthology) =>
      anthology.getGenres().forEach((genre) => genres.add(genre)),
    );

    return genres;
  }

  getAllThemes(): Set<Theme> {
    const themes = new Set<Theme>();
    this.anthologies.forEach((anthology) =>
      anthology.getThemes().forEach((theme) => themes.add(theme)),
    );

    return themes;
  }

  getAllInventories(): Set<InventoryLocation> {
    const inventories = new Set<InventoryLocation>();
    this.anthologies.forEach((anthology) =>
      anthology.inventory_locations?.forEach((inventory) =>
        inventories.add(inventory),
      ),
    );

    return inventories;
  }

  searchByTitle(title: string): Anthology[] {
    const keywords = title.toLowerCase().split(' ');
    const anthologies = this.anthologies.filter((anthology) => {
      const titleNormalized = anthology.title.toLowerCase();
      // check if it matches exactly; this would be ideal
      // and allow us to short circuit checking every keyword
      const searchTermDoesMatchTitleExactly = titleNormalized === title;

      // thunked check for every keyword individually
      const titleContainsEveryKeyword = () => {
        keywords.every((keyword) => titleNormalized.includes(keyword));
      };

      return searchTermDoesMatchTitleExactly || titleContainsEveryKeyword();
    });

    return anthologies;
  }

  searchByAuthor(author: string): Anthology[] {
    const authorNormalized = author.toLowerCase();
    const anthologies = this.anthologies.filter((anthology) => {
      const authors = anthology.getAuthors()?.map(String.prototype.toLowerCase);
      return authors?.includes(authorNormalized);
    });

    return anthologies;
  }
}
