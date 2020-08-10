import { Query } from '../../Routing'
import { Redux,  FilterData, Sort, Segment, Cursor } from '../../Data'
import { Requests } from '../../Async'
import { Dataset, Star, Planet } from '../types'

const levels = [{ columns: new Array(10).fill(null) }, { columns: new Array(10).fill(null) }] // TODO: Store columns in store?

const slice = Redux.slice(
    'database',
    {
        stars: Redux.async<Star[]>(),
        planets: Redux.async<Planet[]>(),
        datasets: Redux.async<Dataset[]>(),
        filter: Redux.empty<FilterData>({}),
        sort: Redux.empty<Sort>({}),
        segment: Redux.empty<Segment>({}),
        usersRank: 0
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
        getStars: async<Cursor, Star[]>('stars', cursor => Requests.get('stars', undefined, cursor)),
        getPlanets: async<Cursor, Planet[]>('planets', cursor => Requests.get('planets', undefined, cursor)),
        getDatasets: async<Cursor, Dataset[]>('datasets', cursor => Requests.get(`datasets`, undefined, cursor))
    })
)

export default slice.reducer
export const { setFilter, setSort, setSegment, getStars, getDatasets, getPlanets } = slice.actions
