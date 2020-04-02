import { useSelector } from 'react-redux'

const selectBodies = state => state.universe.bodies
const selectBodiesSort = state => state.universe.sort
const selectBodiesFilter = state => state.universe.filter
const selectBodiesSegment = state => state.universe.segment

export const useBodies = () => useSelector(selectBodies)

export const useBodiesSort = () => useSelector(selectBodiesSort)

export const useBodiesFilter = () => useSelector(selectBodiesFilter)

export const useBodiesSegment = () => useSelector(selectBodiesSegment)