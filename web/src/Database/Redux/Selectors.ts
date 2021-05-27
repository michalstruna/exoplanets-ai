import { useSelector } from 'react-redux'
import useRouter from 'use-react-router'

import { AsyncData, Cursor } from '../../Data'
import { PlanetRanks } from '../../Stats'
import DbTable from '../Constants/DbTable'
import { SystemData } from '../types'

export const useSort = () => useSelector((state: any) => [state.database.sort])

export const useCursor = () => useSelector((state: any): Cursor => ({
    sort: [state.database.sort],
    segment: state.database.segment,
    filter: state.database.filter
}))

export const useTable = () => useRouter<any>().match.params.table

export const useItems = (table: DbTable) => useSelector(({ database, user }: any) => {
    switch (table) {
        case DbTable.BODIES:
            return database.stars
        case DbTable.STARS:
            return database.stars
        case DbTable.PLANETS:
            return database.planets
        case DbTable.DATASETS:
            return database.datasets
        case DbTable.USERS:
            return user.users
    }
})

export const useSystem = (): AsyncData<SystemData> => useSelector((state: any) => state.database.system)

export const useGlobalStats = () => useSelector((state: any) => state.database.globalStats)
export const usePlotStats = () => useSelector((state: any) => state.database.plotStats)

type DatabaseState = {
    planetRanks: AsyncData<PlanetRanks>
}

type StoreState = {
    database: DatabaseState
}

export const useDatabaseState = () => useSelector((state: StoreState) => state.database)