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

    }
} as Record<DatasetType, any>