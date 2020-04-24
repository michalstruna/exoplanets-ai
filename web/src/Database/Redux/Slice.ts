import SpectralType from '../Constants/SpectralType'
import { Filter, Sort, Segment, Cursor } from '../../Layout'
import { Query, Urls } from '../../Routing'
import { Redux } from '../../Data'

const get = (val: any, i = 0) => Math.round(val * Math.random())

const data: any[] = []

for (let i = 0; i < 256; i++) {
    data.push({
        name: 'VY Canis Majoris',
        mass: get(128, i),
        diameter: get(236, i),
        temperature: get(5536, i) + ' K',
        luminosity: get(128, i),
        absoluteMagnitude: get(12, i),
        color: '#FFAA00',
        spectralClass: SpectralType.A,
        observation: {
            transit: [119.88, 100.21, 86.46, 48.68, 46.12, 39.39, 18.57, 6.98, 6.63, -21.97, -23.17, -29.26, -33.99, -6.25, -28.12, -27.24, -32.28, -12.29, -16.57, -23.86, -5.69, 9.24, 35.52, 81.2, 116.49, 133.99, 148.97, 174.15, 187.77, 215.3, 246.8, -56.68, -56.68, -56.68, -52.05, -31.52, -31.15, -48.53, -38.93, -26.06, 6.63, 29.13, 64.7, 79.74, 12.21, 12.21, -19.94, -28.6, -20.54, 51.39, 22.06, -25.19, -21.59, -12.83, -23.44, -29.86, -23.36, -7.58, -13.74, -12.15, 13.87, 31.66, 28.52, 52.38, 49.17, 90.2, 90.92, 101.25, 18.63, 18.63, 17.73, 0.07, 9.35, -16.77, -22.06, -34.04, -36.12, -20.3, -34.39, -38.15, -39.48, -46.41, -35.29, -37.61, -31.8, -17.83, -11.92, 19.95, 39.26, 42.52, 42.29, 93.7, 10.37, 10.37, 9.49, 8.15, 12.5, -17.51, -16.88],
            radialVelocity: [5736.59, 5699.98, 5717.16, 5692.73, 5663.83, 5631.16, 5626.39, 5569.47, 5550.44, 5458.8, 5329.39, 5191.38, 5031.39, 4769.89, 4419.66, 4218.92, 3924.73, 3605.3, 3326.55, 3021.2, 2800.61, 2474.48, 2258.33, 1951.69, 1749.86, 1585.38, 1575.48, 1568.41, 1661.08, 1977.33, 2425.62, 2889.61, 3847.64, 3847.64, 3741.2, 3453.47, 3202.61, 2923.73, 2694.84, 2474.22, 2195.09, 1962.83, 1705.44, 1468.27, 3730.77, 3730.77, 3833.3, 3822.06, 3803.47, 3813.12, 3726.64, 3628.41, 3551.48, 3487.67, 3281.59, 3162.28, 3020.41, 2870.92, 2677.28, 2516.52, 2240.17, 1979.09, 1819.89, 1634.17, 1456.56, 1320.67, 1223.48, 1229.55, 3364.64, 3364.64, 3511.94, 3656.59, 3746.75, 3861.31, 3805.31, 3787.61, 3759.25, 3694.7, 3610.81, 3560.61, 3398.39, 3313.47, 3105.66, 2930.78, 2688.05, 2481.83, 2205.97, 1902.69, 1715.66, 1558.75, 1484.14, 1317.77, 3320.39, 3320.39, 3395.19, 3465.33, 3592.84, 3687.42, 3861.28]
        },
        planets: new Array(get(2)).fill(null).map(() => ({
            diameter: get(12475, i),
            mass: get(1234, i),
            surfaceTemperature: '128 °C',
            orbitalPeriod: get(1234, i),
            semiMajorAxis: get(123456, i),
            orbitalVelocity: get(72, i),
            density: get(1154, i),
            type: 1
        })),
        type: i % 5,
        distance: get(5, i),
        tmp: null as any
    })
}

for (const i in data) {
    const star = data[i]
    const j = parseInt(i)

    if (j % 4 === 0) {
        star.tmp = star.observation.transit.map((v: any, i: number) => ({
            transit: star.observation.transit[i]
        }))
    } else if (j % 4 === 1) {
        star.tmp = star.observation.transit.map((v: any, i: number) => ({
            radialVelocity: Math.round(star.observation.radialVelocity[i]) / 100
        }))
    } else if (j % 4 === 2) {
        star.tmp = star.observation.transit.map((v: any, i: number) => ({
            transit: star.observation.transit[i],
            radialVelocity: Math.round(star.observation.radialVelocity[i]) / 100
        }))
    } else {

    }
}

const compare = (a: number, b: number) => {
    if (a > b) {
        return 1
    } else if (a < b) {
        return -1
    } else {
        return 0
    }
}

const starColumns = ['', 'type', 'name', 'diameter', 'mass', 'temperature', 'luminosity', 'distance', 'planets.length', '']
const planetColumns = ['', 'type', 'type', 'diameter', 'mass', 'surfaceTemperature', 'orbitalPeriod', 'semiMajorAxis', 'orbitalVelocity', '']

const getSortedItems = <T>(items: T[], sort: any) => { // TODO: Refactor.
    const copyItems = JSON.parse(JSON.stringify(items)) // TODO: Deep clone.
    const accessor = (body: any) => body[sort.level === 0 ? starColumns[sort.column] : planetColumns[sort.column]]

    if (sort.level === 0) {
        const result = [...copyItems].sort((a, b) => compare(accessor(a), accessor(b)) * (sort.isAsc ? 1 : -1))
        addIndex(result)
        return result
    } else if (sort.level === 1) {
        const levelAccessor = (star: any) => star.planets
        const defaultValue = sort.isAsc ? Infinity : -Infinity

        const result = [...copyItems]

        for (const item of result) {
            levelAccessor(item).sort((a: any, b: any) => compare(accessor(a), accessor(b)) * (sort.isAsc ? 1 : -1))
        }

        result.sort((a, b) => (
            compare(levelAccessor(a)[0] ? accessor(levelAccessor(a)[0]) : defaultValue, levelAccessor(b)[0] ? accessor(levelAccessor(b)[0]) : defaultValue) * (sort.isAsc ? 1 : -1)
        ))

        addIndex(result.reduce((total, current) => total.concat(current.planets), []).sort((a: any, b: any) => compare(accessor(a), accessor(b)) * (sort.isAsc ? 1 : -1)))

        return result
    }


    return items
}

const addIndex = <T extends any>(items: T[]) => {
    for (const i in items) {
        items[i].index = parseInt(i)
    }
}

const levels = [{ columns: new Array(10).fill(null) }, { columns: new Array(10).fill(null) }] // TODO: Store columns in store?

const sortLevel = Urls.safeQuery<number>(Query.SORT_LEVEL, v => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < levels.length, 0)
const sortColumn = Urls.safeQuery<number>(Query.SORT_COLUMN, v => typeof v === 'number' && Number.isInteger(v) && v > 0 && v < levels[sortLevel].columns.length, 1)
const sortIsAsc = Urls.safeQuery<number>(Query.SORT_IS_ASC, [0, 1], 1) === 1
const defaultSort: Sort = { column: sortColumn, isAsc: sortIsAsc, level: sortLevel }

const segmentIndex = Urls.safeQuery<number>(Query.SEGMENT_START, v => typeof v === 'number' && Number.isInteger(v) && v >= 0, 0)
const segmentSize = Urls.safeQuery<number>(Query.SEGMENT_SIZE, [5, 10, 20, 50, 100, 200], 20)
const defaultSegment: Segment = { index: segmentIndex, size: segmentSize }


//const [sortLevel, sortColumn, sortIsAsc] = Urls.safeQueries



/*
const defaultFilter: Filter = {
    attribute: Validator.safe(queryUtils.get(Query.FILTER_ATTRIBUTE))
}*/

// TODO: Add "connect with url query"? sort: { isAsc: Redux.connectWithQuery(queryName, Validator) }
const Slice = Redux.slice(
    'database',
    {
        bodies: Redux.async<any /* TODO: Body[] */>(),
        filter: {} as Filter,
        sort: {} as Sort,
        segment: defaultSegment as Segment,
        usersRank: 0,
    },
    ({ async, set, plain }) => ({
        getBodies: async<Cursor>('bodies', ({ sort, filter, segment }) => new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    list: getSortedItems(data, sort).slice(segment.index * segment.size, (segment.index + 1) * segment.size),
                    count: data.length
                })
            }, 1000)
        })),
        setBodiesFilter: plain<Filter>((state, action) => state.filter = action.payload),
        setBodiesSegment: plain<Segment>((state, action) => state.segment = action.payload),
        setBodiesSort: set<Sort>('sort')
    })
)

export default Slice
export const { getBodies, setBodiesFilter, setBodiesSort, setBodiesSegment } = Slice.actions