import { useSelector } from 'react-redux'

const selectBodies = state => state.universe.bodies
const selectBodiesSort = state => state.universe.sort
const selectBodiesFilter = state => state.universe.filter
const selectBodiesPosition = state => state.universe.position

export const useBodies = () => useSelector(selectBodies)

export const useBodiesSort = () => useSelector(selectBodiesSort)

export const useBodiesFilter = () => useSelector(selectBodiesFilter)

export const useBodiesPosition = () => useSelector(selectBodiesPosition)