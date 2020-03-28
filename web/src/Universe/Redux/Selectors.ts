import { useSelector } from 'react-redux'

const selectBodies = state => state.universe.bodies
const selectBodiesSort = state => state.universe.sort
const selectBodiesFilter = state => state.universe.filter

export const useBodies = () => useSelector(selectBodies)

export const useBodiesSort = () => useSelector(selectBodiesSort)

export const useBodiesFilter = () => useSelector(selectBodiesFilter)