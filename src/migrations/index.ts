import * as migration_20250319_194206 from './20250319_194206'
import * as m20250319_194207 from './20250319_194207'
import * as drop_audio_id from './20240323_drop_audio_id'
import * as add_audio_url from './20240323_add_audio_url'
import * as add_event_type from './20240323_add_event_type'

export const migrations = [
  {
    up: migration_20250319_194206.up,
    down: migration_20250319_194206.down,
    name: '20250319_194206',
  },
  m20250319_194207,
  {
    up: drop_audio_id.up,
    down: drop_audio_id.down,
    name: '20240323_drop_audio_id',
  },
  {
    up: add_audio_url.up,
    down: add_audio_url.down,
    name: '20240323_add_audio_url',
  },
  {
    up: add_event_type.up,
    down: add_event_type.down,
    name: '20240323_add_event_type',
  },
]
