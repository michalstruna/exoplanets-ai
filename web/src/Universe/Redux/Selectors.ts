import { useSelector } from 'react-redux'

const selectBodies = state => state.universe.bodies

export const useBodies = () => useSelector(selectBodies)