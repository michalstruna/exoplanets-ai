import { useSelector } from 'react-redux'
import { ProcessData } from '../types'

export const useProcesses = (): ProcessData[] => useSelector((state: any) => state.discovery.processes)