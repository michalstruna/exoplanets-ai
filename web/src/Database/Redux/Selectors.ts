import { useSelector } from 'react-redux'

const selectBodies = (state: any) => state.database.bodies
const selectBodiesSort = (state: any) => state.database.sort
const selectBodiesFilter = (state: any) => state.database.filter
const selectBodiesSegment = (state: any) => state.database.segment
const selectUsersRank = (state: any) => state.database.usersRank

export const useBodies = () => useSelector(selectBodies)

export const useBodiesSort = () => useSelector(selectBodiesSort)

export const useBodiesFilter = () => useSelector(selectBodiesFilter)

export const useBodiesSegment = () => useSelector(selectBodiesSegment)

export const useUsersRank = () => useSelector(selectUsersRank)

export const useDatasets = () => useSelector((state: any) => state.database.datasets)

export const useTable = () => useSelector((state: any) => state.database.table)