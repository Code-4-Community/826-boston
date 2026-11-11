export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type UploadedFileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};
