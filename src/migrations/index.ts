import * as migration_20250319_194206 from './20250319_194206'
import * as m20250319_194207 from './20250319_194207'

export const migrations = [
  {
    up: migration_20250319_194206.up,
    down: migration_20250319_194206.down,
    name: '20250319_194206',
  },
  m20250319_194207,
]
