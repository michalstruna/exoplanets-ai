import { useSelector } from 'react-redux'
import { Cursor } from '../../Layout'

const selectBodies = (state: any) => state.database.bodies
const selectBodiesSort = (state: any) => state.database.sort
const selectUsersRank = (state: any) => state.database.usersRank

export const useBodies = () => useSelector(selectBodies)

export const useSort = () => useSelector(selectBodiesSort)

export const useCursor = () => useSelector((state: any): Cursor => ({
    sort: state.database.sort,
    segment: state.database.segment,
    filter: state.database.filter
}))

export const useUsersRank = () => useSelector(selectUsersRank)

export const useDatasets = () => useSelector((state: any) => state.database.datasets)

export const useTable = () => useSelector((state: any) => state.database.table)