import { useMemo } from 'react';
import { Anthology } from '../types';

// every distinct program name across all publications, sorted A-Z
export default function usePrograms(anthologies: Anthology[]): string[] {
  return useMemo(() => {
    const programs = new Set<string>();
    for (const anthology of anthologies) {
      const values =
        typeof anthology.programs === 'string'
          ? anthology.programs.split(',')
          : anthology.programs ?? [];
      for (const value of values) {
        const program = value.trim();
        if (program) programs.add(program);
      }
    }
    return [...programs].sort((a, b) => a.localeCompare(b));
  }, [anthologies]);
}
