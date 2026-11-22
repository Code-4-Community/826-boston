import { describe, expect, it } from 'vitest';
import { collectDistinctValues } from './filterOptions';
import { Anthology } from '../../../types';

const pub = (fields: Partial<Anthology>) => fields as Anthology;

describe('collectDistinctValues', () => {
  it('collects each value once across publications, sorted A-Z', () => {
    const anthologies = [
      pub({ genres: ['Poetry', 'Mystery'] }),
      pub({ genres: ['Fantasy', 'Poetry'] }),
    ];

    expect(collectDistinctValues(anthologies, 'genres')).toEqual([
      'Fantasy',
      'Mystery',
      'Poetry',
    ]);
  });

  it('trims values and drops empty ones', () => {
    const anthologies = [pub({ themes: ['  Identity ', '', '   '] })];

    expect(collectDistinctValues(anthologies, 'themes')).toEqual(['Identity']);
  });

  it('splits programs that arrive as comma-separated text', () => {
    const anthologies = [pub({ programs: 'Tutoring, Young Authors' })];

    expect(collectDistinctValues(anthologies, 'programs')).toEqual([
      'Tutoring',
      'Young Authors',
    ]);
  });

  it("ignores the '[]' placeholder stored for publications without themes", () => {
    const anthologies = [
      pub({ themes: ['[]'] }),
      pub({ themes: ['Culture'] }),
      pub({ themes: [] }),
    ];

    expect(collectDistinctValues(anthologies, 'themes')).toEqual(['Culture']);
  });

  it('copes with publications that have no value for the field', () => {
    const anthologies = [pub({}), pub({ genres: undefined })];

    expect(collectDistinctValues(anthologies, 'genres')).toEqual([]);
    expect(collectDistinctValues([], 'genres')).toEqual([]);
  });
});
