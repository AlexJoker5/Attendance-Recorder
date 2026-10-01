export interface OriginalFileMetadata {
  path: string;
  sha256: string;
  byteSize: number;
  fileType: 'csv' | 'xlsx';
}
