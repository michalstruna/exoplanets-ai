import DatasetType from './DatasetType'

export default {
    [DatasetType.STAR_PROPERTIES]: {
        name: 'name',
        surfaceTemperature: 'surface_temperature',
        diameter: 'diameter',
        mass: 'mass',
        ra: 'ra',
        dec: 'dec',
        distance: 'distance',
        apparentMagnitude: 'apparent_magnitude',
        metallicity: 'metallicity'
    },
    [DatasetType.TARGET_PIXEL]: {
        name: 'name'
    },
    [DatasetType.SYSTEM_NAMES]: {
        name1: 'name1',
        name2: 'name2',
        name3: 'name3',
        name4: 'name4',
        name5: 'name5',
        name6: 'name6'
    }
} as Record<DatasetType, any>