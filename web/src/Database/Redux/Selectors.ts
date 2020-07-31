import { useSelector } from 'react-redux'
import { Cursor } from '../../Layout'
import DbTable from '../Constants/DbTable'
import useRouter from 'use-react-router'

const selectBodiesSort = (state: any) => state.database.sort
const selectUsersRank = (state: any) => state.database.usersRank

export const useSort = () => useSelector(selectBodiesSort)

export const useCursor = () => useSelector((state: any): Cursor => ({
    sort: state.database.sort,
    segment: state.database.segment,
    filter: state.database.filter
}))

export const useUsersRank = () => useSelector(selectUsersRank)

export const useTable = () => useRouter<any>().match.params.table

export const useItems = (table: DbTable) => useSelector(({ database }: any) => {
    switch (table) {
        case DbTable.BODIES:
            return database.stars
        case DbTable.STARS:
            return database.stars
        case DbTable.PLANETS:
            return database.planets
        case DbTable.DATASETS:
            return database.datasets
    }
})