import { Query } from '../../Routing'
import { Redux,  FilterData, Sort, Segment, Cursor, ItemId, SegmentData } from '../../Data'
import { Requests } from '../../Async'
import { Dataset, StarData, PlanetData, DatasetNew, DatasetUpdated, DatasetSelection, SystemData, Constellation } from '../types'
import { AggregatedStats, GlobalAggregatedStats, PlanetRanks, PlotStats } from '../../Stats'

const levels = [{ columns: new Array(10).fill(null) }, { columns: new Array(10).fill(null) }] // TODO: Store columns in store?

const slice = Redux.slice(
    'database',
    {
        stars: Redux.async<SegmentData<StarData>>(),
        planets: Redux.async<SegmentData<PlanetData>>(),
        filter: Redux.empty<FilterData>({}),
        sort: Redux.empty<Sort>({}),
        segment: Redux.empty<Segment>({}),
        system: Redux.async<SystemData>(),
        usersRank: 0,
        globalStats: Redux.async<GlobalAggregatedStats>(),
        plotStats: Redux.async<PlotStats>(),
        planetRanks: Redux.async<PlanetRanks>(),

        datasets: Redux.async<SegmentData<Dataset>>(),
        newDataset: Redux.async<Dataset>(),

        updatedItem: Redux.async<Dataset>(),
        deletedItem: Redux.async<void>(),
        resetItem: Redux.async<void>(),
        constellations: Redux.async<Constellation[]>()
    },
    ({ async, set }) => ({
        setFilter: set<FilterData>('filter', {
            syncObject: () => ({ // TODO: Validate filter.
                attribute: [Query.FILTER_ATTRIBUTE, () => true, []],
                relation: [Query.FILTER_RELATION, () => true, []],
                value: [Query.FILTER_VALUE, () => true, []]
            })
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
        getPlanets: async<Cursor, PlanetData[]>('planets', cursor => Requests.get('planets', undefined, cursor)),
        getSystem: async<ItemId, StarData>('system', name => Requests.get(`stars/name/${name}`)),
        getGlobalStats: async<void, AggregatedStats>('globalStats', () => Requests.get(`global_stats/aggregated`)),
        getPlotStats: async<void, PlotStats>('plotStats', () => Requests.get(`global_stats/plots`)),
        getPlanetRanks: async<void, PlanetRanks>('planetRanks', () => Requests.get(`planets/ranks`)),

        getStars: async<Cursor, StarData[]>('stars', cursor => Requests.get('stars', undefined, cursor)),
        deleteStar: async<[ItemId, DatasetSelection<StarData>], StarData>('deletedItem', ([id, datasetSelection]) => Requests.delete(`stars/${id}/selection`, datasetSelection), {
            onSuccess: (state, action) => (action.payload ? Redux.updateInSegment : Redux.deleteFromSegment)('stars')(state, action)
        }),

        getDatasets: async<Cursor, SegmentData<Dataset>>('datasets', cursor => Requests.get(`datasets`, undefined, cursor)),
        addDataset: async<DatasetNew, Dataset>('newDataset', dataset => Requests.post(`datasets`, dataset), { onSuccess: Redux.addToSegment('datasets') }),
        updateDataset: async<[ItemId, DatasetUpdated], Dataset>('updatedItem', ([id, dataset]) => Requests.put(`datasets/${id}`, dataset), { onSuccess: Redux.updateInSegment('datasets') }),
        deleteDataset: async<ItemId, void>('updatedItem', id => Requests.delete(`datasets/${id}`), { onSuccess: Redux.deleteFromSegment('datasets') }),
        resetDataset: async<ItemId, void>('updatedItem', id => Requests.put(`datasets/${id}/reset`)),
        getConstellations: async<void, Constellation[]>('constellations', () => Requests.get(`stars/constellations`))
    })
)

export default slice.reducer
export const {
    setFilter, setSort, setSegment,
    getStars, deleteStar,
    getDatasets, addDataset, updateDataset, deleteDataset, resetDataset,
    getPlanets,
    getSystem,
    getGlobalStats, getPlotStats, getPlanetRanks,
    getConstellations
} = slice.actions
