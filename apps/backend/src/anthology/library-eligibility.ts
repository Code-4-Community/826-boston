import { FindOptionsWhere, In } from 'typeorm';
import { Anthology } from './anthology.entity';
import { AnthologyStatus } from './types';

export const LIBRARY_STATUSES = [
  AnthologyStatus.CAN_BE_SHARED,
  AnthologyStatus.ARCHIVED,
];

/** Query condition for publications the public Library may show. */
export const libraryWhere: FindOptionsWhere<Anthology> = {
  status: In(LIBRARY_STATUSES),
  releaseFormsOnFile: true,
};

export function isLibraryEligible(
  anthology: Pick<Anthology, 'status' | 'releaseFormsOnFile'>,
): boolean {
  return (
    LIBRARY_STATUSES.includes(anthology.status) &&
    anthology.releaseFormsOnFile === true
  );
}

/**
 * Anonymous callers always get the Library rule. Logged-in callers get it only
 * when the request says it's for the Library (the Tracker shares these routes
 * until #197).
 */
export function isLibraryRequest(
  user: unknown,
  libraryFlag?: boolean | string,
): boolean {
  return !user || libraryFlag === true || libraryFlag === 'true';
}
