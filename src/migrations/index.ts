import * as migration_20250314_195529 from './20250314_195529';

export const migrations = [
  {
    up: migration_20250314_195529.up,
    down: migration_20250314_195529.down,
    name: '20250314_195529'
  },
];
