import * as migration_20250314_195529 from './20250314_195529';
import * as migration_20250314_203911 from './20250314_203911';
import * as migration_20250315_150926 from './20250315_150926';
import * as migration_20250315_173131 from './20250315_173131';

export const migrations = [
  {
    up: migration_20250314_195529.up,
    down: migration_20250314_195529.down,
    name: '20250314_195529',
  },
  {
    up: migration_20250314_203911.up,
    down: migration_20250314_203911.down,
    name: '20250314_203911',
  },
  {
    up: migration_20250315_150926.up,
    down: migration_20250315_150926.down,
    name: '20250315_150926',
  },
  {
    up: migration_20250315_173131.up,
    down: migration_20250315_173131.down,
    name: '20250315_173131'
  },
];
