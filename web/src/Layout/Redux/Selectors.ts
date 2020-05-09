import { useSelector } from 'react-redux'

export const useTooltip = () => useSelector((state: any) => state.layout.tooltip)