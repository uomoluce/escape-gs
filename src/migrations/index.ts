import * as migration_20250319_193014 from './20250319_193014';
import * as migration_20250319_194206 from './20250319_194206';

export const migrations = [
  {
    up: migration_20250319_193014.up,
    down: migration_20250319_193014.down,
    name: '20250319_193014',
  },
  {
    up: migration_20250319_194206.up,
    down: migration_20250319_194206.down,
    name: '20250319_194206'
  },
];
