import { useSelector } from 'react-redux'

const selectBodies = (state: any) => state.universe.bodies
const selectBodiesSort = (state: any) => state.universe.sort
const selectBodiesFilter = (state: any) => state.universe.filter
const selectBodiesSegment = (state: any) => state.universe.segment
const selectUsersRank = (state: any) => state.universe.usersRank

export const useBodies = () => useSelector(selectBodies)

export const useBodiesSort = () => useSelector(selectBodiesSort)

export const useBodiesFilter = () => useSelector(selectBodiesFilter)

export const useBodiesSegment = () => useSelector(selectBodiesSegment)

export const useUsersRank = () => useSelector(selectUsersRank)