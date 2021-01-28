import { UnitTypeData } from '../types'

export default {
    HOURS: [[' h', 3600000000]],
    GIB: [[' GiB', 1024**3]],
    KM: [[' km', 1]],
    LY: [[' ly', 1]],

    TIME: [[' ms', 1], [' s', 1000], [' m', 60 * 1000], [' h', 60 * 60 * 1000]],
    MEMORY: [[' B', 1], [' kiB', 1024], [' MiB', 1024**2], [' GiB', 1024**3]],

    SCALAR: [['', 1]]
} as Record<string, UnitTypeData>