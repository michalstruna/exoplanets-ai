import { Strings } from "../../Native"

export const osList = ['windows', 'ubuntu', 'debian', 'macos', 'linux']
export const cpuList = ['intel', 'amd']

export const getIcon = (name: string, values: string[], directory: string, defaultIcon: string = 'Default') => {
    for (const value of values) {
        if (name.toLowerCase().includes(value.toLowerCase())) {
            return `${directory}/${Strings.capitalize(value)}.svg`
        }
    }

    return `${directory}/${defaultIcon}.svg`
}

export const getOsIcon = (os: string) => getIcon(os, osList, 'Discovery/Process/OS')

export const getCpuIcon = (cpu: string) => getIcon(cpu, cpuList, 'Discovery/Process/CPU')