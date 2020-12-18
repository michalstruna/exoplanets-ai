import { Query } from '../../Routing'
import { Redux,  FilterData, Sort, Segment, Cursor } from '../../Data'
import { Requests } from '../../Async'
import { Dataset, StarData, PlanetData, DatasetNew } from '../types'
import { AggregatedStats, PlotStats } from '../../Stats'

const levels = [{ columns: new Array(10).fill(null) }, { columns: new Array(10).fill(null) }] // TODO: Store columns in store?

const slice = Redux.slice(
    'database',
    {
        stars: Redux.async<StarData[]>(),
        planets: Redux.async<PlanetData[]>(),
        datasets: Redux.async<Dataset[]>(),
        filter: Redux.empty<FilterData>({}),
        sort: Redux.empty<Sort>({}),
        segment: Redux.empty<Segment>({}),
        system: Redux.async<StarData>(),
        usersRank: 0,
        globalStats: Redux.async<AggregatedStats>(),
        plotStats: Redux.async<PlotStats>(),

        newDataset: Redux.async<Dataset>()
    },
    ({ async, set }) => ({
        setFilter: set<FilterData>('filter', {
            /*syncObject: () => ({ // TODO: Validate filter.
                attribute: [Query.FILTER_ATTRIBUTE, () => true, []],
                relation: [Query.FILTER_RELATION, () => true, []],
                value: [Query.FILTER_VALUE, () => true, []]
            })*/
        }),
        setSegment: set<Segment>('segment', {
            syncObject: () => ({
                index: [Query.SEGMENT_START, v => Number.isInteger(v) && v >= 0, 0],
                size: [Query.SEGMENT_SIZE, [5, 10, 20, 50, 100, 200], 20]
            })
        }),
        setSort: set<Partial<Sort>>('sort', {
            syncObject: state => ({ // TODO: Level must be before column. Object is not order-safe. Replace key by first item array?
                level: [Query.SORT_LEVEL, [0, 1]],
                column: [Query.SORT_COLUMN, v => Number.isInteger(v!) && v! > 0 && v! < levels[state.sort.level].columns.length],
                isAsc: [Query.SORT_IS_ASC, [false, true]]
            })
        }),
        getStars: async<Cursor, StarData[]>('stars', cursor => Requests.get('stars', undefined, cursor)),
        getPlanets: async<Cursor, PlanetData[]>('planets', cursor => Requests.get('planets', undefined, cursor)),
        getDatasets: async<Cursor, Dataset[]>('datasets', cursor => Requests.get(`datasets`, undefined, cursor)),
        getSystem: async<string, StarData>('system', name => Requests.get(`stars/name/${name}`)),
        getGlobalStats: async<void, AggregatedStats>('globalStats', () => Requests.get(`global_stats/aggregated`)),
        getPlotStats: async<void, PlotStats>('plotStats', () => Requests.get(`global_stats/plots`)),

        addDataset: async<DatasetNew, Dataset>('newDataset', newDataset => Requests.post(`datasets`, newDataset))
    })
)

export default slice.reducer
export const {
    setFilter, setSort, setSegment,
    getStars,
    getDatasets, addDataset,
    getPlanets,
    getSystem,
    getGlobalStats, getPlotStats
} = slice.actions
