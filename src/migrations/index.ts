import * as migration_20261009_142637_initial from './20261009_142637_initial'

export const migrations = [
  {
    up: migration_20261009_142637_initial.up,
    down: migration_20261009_142637_initial.down,
    name: '20261009_142637_initial',
  },
]
