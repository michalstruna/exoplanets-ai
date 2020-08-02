import { Filter, Sort, Segment, Cursor } from '../../Layout'
import { Query } from '../../Routing'
import { Redux } from '../../Data'
import { Requests } from '../../Async'
import { Dataset, Star, Planet } from '../types'

const levels = [{ columns: new Array(10).fill(null) }, { columns: new Array(10).fill(null) }] // TODO: Store columns in store?

const slice = Redux.slice(
    'database',
    {
        stars: Redux.async<Star[]>(),
        planets: Redux.async<Planet[]>(),
        datasets: Redux.async<Dataset[]>(),
        filter: Redux.empty<Filter>({}),
        sort: Redux.empty<Sort>({}),
        segment: Redux.empty<Segment>({}),
        usersRank: 0
    },
    ({ async, set }) => ({
        setFilter: set<Filter>('filter', {
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
        setSort: set<Sort>('sort', {
            syncObject: state => ({ // TODO: Level must be before column. Object is not order-safe. Replace key by first item array?
                level: [Query.SORT_LEVEL, [0, 1], 0],
                column: [Query.SORT_COLUMN, v => Number.isInteger(v) && v > 0 && v < levels[state.sort.level].columns.length, 2],
                isAsc: [Query.SORT_IS_ASC, [false, true], true]
            })
        }),
        getStars: async<Cursor, Star[]>('stars', ({ segment, sort, filter }) => Requests.get('stars')), // TODO: Send cursor.
        getPlanets: async<Cursor, Planet[]>('planets', cursor => Requests.get('planets', undefined, cursor)), // TODO: Send cursor.
        getDatasets: async<Cursor, Dataset[]>('datasets', ({ segment, sort, filter }) => Requests.get(`datasets`)) // TODO: Send cursor.
    })
)

export default slice.reducer
export const { setFilter, setSort, setSegment, getStars, getDatasets, getPlanets } = slice.actions