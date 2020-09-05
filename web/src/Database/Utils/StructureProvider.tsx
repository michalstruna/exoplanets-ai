import React from 'react'
import Styled from 'styled-components'
import Url from 'url'
import prettyBytes from 'pretty-bytes'
import { pascalCase } from 'change-case'

import DbTable from '../Constants/DbTable'
import { Fraction, IconText, Level, ProgressBar } from '../../Layout'
import { MiniGraph } from '../../Stats'
import { image, size } from '../../Style'
import { getDatasets, getStars, getPlanets } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'
import LifeType from '../Constants/LifeType'
import * as Col from './Col'
import { Dataset, Planet, PlanetProperties, Star } from '../types'
import Detail from '../Components/TableItemDetail'
import SpectralClass from '../Constants/SpectralClass'
import { Cursor, EnumTextValues } from '../../Data'
import PlanetType from '../Constants/PlanetType'
import { DatasetType } from '../index'
import DatasetPriority from '../Constants/DatasetPriority'
import LuminosityClass from '../Constants/LuminosityClass'
import PlanetStatus from '../Constants/PlanetStatus'
import { MultiValue } from './Col'

const dd = [0.99742, 1.00001, 1.00002, 1.00003, 1.00005, 1.00001, 0.99996, 1.0, 1.00001, 1.00004, 0.99993, 0.99886, 0.99744, 0.99997, 1.00001, 1.00003, 1.00002, 0.99998, 0.99992, 1.00002, 1.00004, 1.00005, 0.99999, 0.99911, 0.99723, 0.99995, 1.00002, 1.00002, 1.00002, 0.99999, 0.99995, 0.99998, 1.00003, 1.00004, 1.00001, 0.99879, 0.99766, 0.99992, 0.99998, 0.99999, 1.00002, 1.00001, 0.99998, 1.00002, 1.00004, 1.00002, 0.99999, 0.99885, 0.99751, 0.99995, 0.99998, 1.00002, 1.0, 0.99997, 0.99992, 1.00003, 1.00018, 1.00004, 1.00001, 0.99903, 0.99728, 0.99993, 1.0, 1.00005, 1.00003, 0.99997, 0.99989, 0.99999, 1.00001, 1.00002, 1.0, 0.99997, 1.0, 1.00002, 1.00001, 0.99995, 0.99875, 0.99755, 0.99998, 1.0, 1.00004, 1.00002, 0.99997, 0.99994, 1.00002, 1.00005, 1.00003, 0.99997, 0.99899, 0.99767, 0.99995, 0.99998, 1.00002, 1.00003, 0.99999, 0.99996, 1.00001, 1.00002, 1.00002, 0.99999, 0.99869, 0.99779, 0.99997, 1.0, 1.00001, 1.00004, 1.0, 0.99996, 0.99999, 1.00001, 1.00002, 0.99997, 0.99872, 0.99759, 0.99998, 1.0, 1.0, 1.00001, 0.99999, 0.99998, 1.00001, 1.00005, 1.00002, 0.99997, 0.9989, 0.99771, 0.99996, 1.0, 1.00003, 1.00003, 0.99998, 0.99994, 1.00001, 1.00003, 1.00004, 0.99996, 0.99848, 0.99787, 0.99995, 0.99998, 1.00002, 1.00003, 0.99999, 0.99997, 1.00003, 1.00004, 1.00002, 0.99997, 0.99844, 0.99766, 0.99996, 1.00001, 1.00001, 1.00002, 0.99998, 0.99994, 1.00001, 1.00004, 1.00002, 0.99997, 0.99885, 0.99777, 0.99996, 1.0, 1.00003, 1.00005, 0.99998, 0.99996, 1.0, 1.0, 1.00002, 0.99996, 0.99842, 0.99789, 0.99995, 0.99998, 1.00002, 1.00005, 0.99998, 0.99997, 1.00002, 1.00002, 1.00002, 0.99995, 0.99861, 0.99774, 0.99997, 1.00002, 1.00004, 1.00002, 0.99997, 0.99994, 1.00002, 1.00005, 1.00004, 0.99996, 0.9988, 0.9978, 0.99993, 1.00001, 1.00005, 1.00003, 0.99998, 0.99998, 1.00004, 1.00001, 0.99999, 0.99998, 0.99885, 0.99797, 0.99996, 1.0, 0.99992, 1.00001, 0.99993, 0.99998, 1.00002, 1.00003, 1.00003, 1.00005, 0.99851, 0.99777, 0.99997, 1.00001, 1.00002, 1.00002, 0.99999, 0.99995, 1.0, 1.00003, 1.0, 1.0, 0.99832, 0.99824, 0.99996, 0.99998, 1.00003, 1.00002, 0.99996, 0.99997, 1.00003, 1.00003, 1.00002, 0.99995, 0.9983, 0.99802, 0.99996, 1.00002, 1.00005, 1.00003, 1.00002, 0.99996, 0.99999, 1.00003, 1.0, 0.99997, 0.99846, 0.99786, 0.99998, 0.99999, 1.00003, 1.00002, 0.99998, 0.99996, 1.00005, 1.00006, 1.00002, 0.99994, 0.99824, 0.99798, 0.99996, 1.00002, 1.00004, 1.00004, 0.99992, 0.99994, 0.99998, 1.00001, 1.00002, 0.99998, 0.99826, 0.9981, 0.99995, 1.0, 1.00002, 1.00004, 1.00002, 1.00001, 1.00005, 1.00003, 0.99997, 0.99994, 0.99844, 0.99812, 0.99999, 1.00007, 0.99998, 0.99843, 0.99819, 0.99997, 1.00001, 1.00002, 1.00001, 0.99997, 0.99996, 1.00001, 1.00002, 0.99999, 0.99993, 0.99793, 0.99839, 0.99998, 1.00006, 1.00003, 1.00002, 0.99996, 0.99996, 1.0, 1.00003, 1.00001, 0.99995, 0.99813, 0.99818, 0.99997, 1.00001, 1.00004, 1.00005, 1.00001, 0.99997, 1.00001, 1.00001, 0.99998, 0.99994, 0.99807, 0.99826, 1.0, 1.00001, 1.00002, 1.00001, 0.99997, 0.99999, 1.00002, 1.00002, 1.0, 0.99992, 0.99782, 0.99844, 0.99998, 1.00004, 1.00007, 1.00002, 0.99997, 0.99996, 0.99998, 0.99999, 1.00001, 0.99999, 0.9981, 0.99827, 0.99999, 1.00001, 1.00003, 1.00005, 1.00003, 1.00001, 1.00002, 1.0, 0.99997, 0.99994, 0.99788, 0.99865, 1.00002, 1.00004, 1.00002, 1.00001, 0.99992, 0.99991, 1.00003, 1.0, 0.99807, 0.99831, 0.99998, 1.00002, 1.0, 1.00002, 0.99998, 0.99997, 1.00001, 1.00003, 1.0, 0.99994, 0.99777, 0.99876, 1.0, 1.00002, 1.00003, 1.00001, 0.99994, 0.99996, 1.00001, 1.00003, 1.00001, 0.99992, 0.99772, 0.99855, 0.99997, 1.00002, 1.00006, 1.00006, 0.99996, 0.99995, 1.0, 1.00001, 0.99998, 0.99995, 0.99799, 0.99838, 0.99999, 1.00001, 1.00002, 1.00003, 1.0, 1.00001, 1.00002, 1.00002, 0.99998, 0.99993, 0.99752, 0.9988, 1.00002, 1.00003, 1.00005, 1.0, 1.00049, 0.99996, 1.00001, 1.00002, 1.00002, 0.99996, 0.99768, 0.99861, 0.99997, 1.0, 1.00003, 1.00004, 0.99998, 1.0, 1.00001, 1.00003, 0.99998, 0.99992, 0.99789, 0.99862, 1.0, 1.00002, 1.00004, 1.00001, 0.99994, 0.99998, 1.00001, 1.00003, 0.99998, 0.99994, 0.99745, 0.99885, 0.99998, 1.00003, 1.00004, 1.00003, 0.99995, 0.99998, 1.00002, 1.00002, 0.99997, 0.99992, 0.9973, 0.99865, 0.99999, 1.00003, 1.00004, 1.00003, 0.99996, 0.99996, 1.0, 1.00002, 0.99999, 0.99989, 0.99787, 0.99882, 1.0001, 1.00009, 1.00002, 1.00005, 0.99997, 0.99996, 0.99998, 1.0, 0.99998, 0.99993, 0.99742, 0.99893, 1.00001, 1.00002, 1.00003, 1.0, 0.99996, 0.99998, 1.0, 1.00001, 0.99996, 0.9999, 0.99759, 0.9987, 1.0, 1.00005, 1.00005, 1.00004, 0.99996, 0.99994, 1.0, 1.00001, 1.0, 0.99992, 0.99782, 0.99871, 0.99999, 1.00002, 1.00004, 1.00004, 1.0, 1.00001, 1.00001, 1.0, 0.99998, 0.99994, 0.99736, 0.99897, 1.00001, 1.00004, 1.00002, 1.0, 0.99994, 0.99997, 1.00002, 1.00003, 0.99999, 0.99991, 0.99754, 0.99874, 0.99998, 1.00002, 1.00009, 1.00007, 0.99996, 0.99998, 1.00001, 1.00001, 0.99999, 0.99996, 0.99752, 0.9992, 0.99999, 1.00002, 1.00002, 1.00003, 0.99998, 1.00001, 1.00003, 1.00001, 0.99997, 0.99991, 0.99732, 0.99902, 1.00002, 1.00005, 1.00005, 1.00001, 0.99994, 0.99996, 0.99998, 1.00002, 0.99999, 0.99991, 0.9975, 0.99881, 0.99998, 1.00003, 1.00005, 1.00006, 0.99998, 0.99997, 0.99999, 1.00001, 0.99999, 0.99995, 0.99771, 0.99926, 1.0, 1.00002, 1.00002, 1.00003, 0.99996, 0.99997, 1.00003, 1.00001, 0.99997, 0.99988, 0.99726, 0.99906, 1.0, 1.00005, 1.00004, 1.00001, 0.99996, 0.99997, 1.00002, 1.0, 1.0, 0.99992, 0.99745, 0.999, 1.0, 1.00004, 1.00005, 1.00004, 0.99996, 0.99998, 1.0, 0.99999]
const dd3 = [1.0000112539056625, 1.0000074799519765, 1.0000104110038475, 1.0000129150228423, 1.0000138480655258, 1.0000143502360361, 1.0000169987384753, 1.0000188856003986, 1.0000167023352196, 1.0000158915896507, 1.0000169612536636, 1.0000163476940092, 1.0000176318814107, 1.0000208199493028, 1.0000136760837093, 1.0000181425545283, 1.0000114482217473, 1.0000151867456837, 1.0000138829240066, 1.0000141358034695, 1.000015817745424, 1.0000122129289861, 1.0000160996287342, 1.0000095811762333, 1.0000086026870574, 1.0000103104411096, 1.0000098252484846, 1.0000101447967071, 1.0000065826184827, 1.0000103616251232, 1.0000082842131819, 1.0000077430473537, 1.0000095076257465, 1.0000080392820467, 1.0000064128976736, 1.000005122457135, 1.0000073865489134, 1.0000092291065117, 1.0000074842410258, 1.0000088448079194, 1.0000066077862828, 1.0000053884353794, 1.0000054594263459, 1.0000016577754147, 1.000007264598958, 0.9999938410836967, 0.9999410456480837, 0.99987602240261, 0.9998367484042088, 0.9998319506208092, 0.9998202808310264, 0.9998260818670424, 0.9998274007523485, 0.9998423324754429, 0.9998880909607862, 0.9999506989204714, 0.9999988723718775, 1.0000055017574263, 1.0000021806555282, 1.0000106074715855, 1.000005700501266, 1.0000043553543232, 1.0000038059245027, 1.000008576259746, 1.0000040732523414, 1.0000028587414898, 1.000003853181801, 0.9999987185445529, 1.0000080157297682, 1.0000018433887343, 1.000009111763168, 1.000001460522615, 1.0000075898447702, 1.0000001946408728, 1.0000036266779024, 1.0000087701415186, 1.0000073347372642, 1.0000086979907905, 1.0000084003882845, 1.0000079481226236, 1.0000130751377243, 1.0000131583701846, 1.000013870178919, 1.0000148739647563, 1.0000128684216292, 1.0000134086587227, 1.0000167349562537, 1.0000177310604377, 1.0000130412063015, 1.0000113590500932, 1.000017058544794, 1.0000182586046766, 1.0000146208835639, 1.0000183034649608, 1.0000148538139007, 1.0000158579673657, 1.000014462981745, 1.0000077085079369, 1.0000102586497248, 1.0000083695303297]

const SpectralType = Styled.div`
    display: inline-block;
    font-weight: bold;
    font-style: normal;
`

const DateTime = ({ s }: { s: number }) => (
    <>
        {Dates.formatDate(s)}
        <br />
        {Dates.formatTime(s)}
    </>
)

const OptionalLine = ({ lines }: { lines: (string | null)[] }) => (
    <>
        {lines.filter(line => !!line).map(line => <div>{line}</div>)}
    </>
)

const lifeTypeStyle = { [LifeType.PROMISING]: { color: '#AFA', fontWeight: 'bold' }, [LifeType.IMPOSSIBLE]: { color: '#FAA' }, [LifeType.UNKNOWN]: { color: '#777', fontStyle: 'italic' }, [LifeType.POSSIBLE]: { color: '#5FF', fontWeight: 'bold' } }
const planetStatusStyle = { [PlanetStatus.CANDIDATE]: { color: '#AAA', fontStyle: 'italic' }, [PlanetStatus.CONFIRMED]: { color: '#AFA', fontWeight: 'bold' }, [PlanetStatus.REJECTED]: { color: '#F55' } }
const priorityStyle = { 1: { color: '#666' }, 2: { color: '#888' }, 3: { color: '#EEE' }, 4: { color: '#EAA', fontWeight: 'bold' }, 5: { color: '#F55', fontWeight: 'bold' } }
const spectralClassColor: Record<string, string> = { default: '#999', [SpectralClass.A]: '#DFF', [SpectralClass.B]: '#3FF', [SpectralClass.F]: '#EE0', [SpectralClass.G]: '#CC0', [SpectralClass.K]: '#F80', [SpectralClass.M]: '#F50', [SpectralClass.O]: '#0FF' }

// TODO: Hooks instaed providers?
// TODO: Root strings in parameter.
export const provideFilterColumns = (table: DbTable, strings: any): [string, string, EnumTextValues][] => {
    switch (table) {
        case DbTable.BODIES:
            return [
                ['name', strings.properties.name, String],
                ['spectral_class', strings.properties.spectral_class, Object.values(SpectralClass).map(value => ({ text: `${strings.stars.colors[value]} (${value})`, value }))],
                ['luminosity_class', strings.properties.luminosity_class, Object.values(LuminosityClass).map(value => ({ text: `${strings.stars.sizes[value]} (${value})`, value }))],
                ['diameter', strings.properties.diameter + ' [☉]', Number],
                ['mass', strings.properties.mass + ' [☉]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [K]', Number],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['luminosity', strings.properties.luminosity + ' [☉]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['planets', strings.properties.planets, Number],
                ['surface_gravity', strings.properties.surfaceGravity + ' [km/s]', Number],
                ['absolute_magnitude', strings.properties.absoluteMagnitude, Number],
                ['apparent_magnitude', strings.properties.apparentMagnitude, Number],
                ['metallicity', strings.properties.metallicity, Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditions[value], value }))],
                ['dataset', strings.properties.dataset, String],
                ['planet_name', strings.properties.name + ' (' + strings.properties.planet + ')', String],
                ['planet_type', strings.properties.type + ' (' + strings.properties.planet + ')', Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                ['planet_diameter', strings.properties.diameter + ' [⊕]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_mass', strings.properties.mass + ' [⊕]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_density', strings.properties.density + ' [kg/m^3]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_surface_temperature', strings.properties.surfaceTemperature + ' [°C]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_semi_major_axis', strings.properties.semiMajorAxis + ' [au]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_orbital_period', strings.properties.orbitalPeriod + ' [d]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_orbital_velocity', strings.properties.orbitalVelocity + ' [km/s]' + ' (' + strings.properties.planet + ')', Number],
                ['planet_life_conditions', strings.properties.lifeConditions + ' (' + strings.properties.planet + ')', Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditions[value], value }))],
                ['planet_transit_depth', strings.properties.transit + ' (' + strings.properties.planet + ')', Number],
                ['planet_dataset', strings.properties.dataset + ' (' + strings.properties.planet + ')', String]
            ]
        case DbTable.STARS:
            return [
                ['name', strings.properties.name, String],
                //['type', strings.properties.type, Object.values(StarSize).map(value => ({ text: strings.stars.types[value], value }))],
                ['diameter', strings.properties.diameter + ' [☉]', Number],
                ['mass', strings.properties.mass + ' [☉]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [K]', Number],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['luminosity', strings.properties.luminosity + ' [☉]', Number],
                ['gravity', strings.properties.surfaceGravity + ' [km/s]', Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditions[value], value }))],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['dataset', strings.properties.dataset, String]
            ]
        case DbTable.PLANETS:
            return [
                ['name', strings.properties.name, String],
                ['type', strings.properties.type, Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                ['diameter', strings.properties.diameter + ' [⊕]', Number],
                ['mass', strings.properties.mass + ' [⊕]', Number],
                ['density', strings.properties.density + ' [kg/m^3]', Number],
                ['surface_temperature', strings.properties.surfaceTemperature + ' [°C]', Number],
                ['semi_major_axis', strings.properties.semiMajorAxis + ' [au]', Number],
                ['orbital_period', strings.properties.orbitalPeriod + ' [d]', Number],
                ['orbital_velocity', strings.properties.orbitalVelocity + ' [km/s]', Number],
                ['life_conditions', strings.properties.lifeConditions, Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditions[value], value }))],
                ['distance', strings.properties.distance + ' [ly]', Number],
                ['transit_depth', strings.properties.transit, Number],
                ['dataset', strings.properties.dataset, String]
            ]
        case DbTable.DATASETS:
            return [
                ['name', strings.properties.name, String],
                ['type', strings.properties.type, Object.values(DatasetType).map(value => ({ text: strings.datasets.types[value], value }))],
                ['total_size', strings.properties.totalSize, Number],
                ['processed', strings.properties.processed + ' [B]', Number],
                ['time', strings.properties.time + ' [s]', Number],
                ['created', strings.properties.published, Date],
                ['modified', strings.properties.modified, Date],
                ['priority', strings.properties.priority, Object.values(DatasetPriority).filter(value => typeof value === 'number').map(value => ({ text: strings.datasets.priorities[value], value }))], // TODO: DatasetPriority enum.
                ['url', strings.properties.url, Number]
            ]
    }

    return []
}

type Structure = {
    levels: Level[]
    getter: (cursor: Cursor) => void
    rowHeight: (row: number, level: number) => number
}

const StarType = ({ star, strings }: { star: Star, strings: any }) => {
    if (!star.properties || !star.properties[0]) {
        return (
            <Colored color={'default'}>
                {strings.stars.unknownType + ' ' + strings.stars.unknownSize.toLowerCase()}
            </Colored>
        )
    }

    const type = star.properties[0].type

    return (
        <Colored color={spectralClassColor[type.spectral_class || 'default']}>
            {(strings.stars.colors[type.spectral_class!] || strings.stars.unknownType) + ' '}
            {(strings.stars.sizes[type.luminosity_class!] || strings.stars.unknownSize).toLowerCase() + ' '}
            <SpectralType>
                {type.spectral_class}
                {type.spectral_subclass}
                {type.luminosity_class}
                {type.luminosity_subclass}
            </SpectralType>
        </Colored>
    )
}

interface PropertiesProps {
    item: Star | Planet
    render: (name: string, type: any) => React.ReactElement
}

const Properties = ({ item, render }: PropertiesProps) => {
    if (!item.properties || !item.properties[0]) {
        if ('light_curves' in item && item.light_curves[0]) {
            return render(item.light_curves[0].name, {})
        }

        return null
    }

    return render(item.properties[0].name, item.properties[0].type)
}


export const provideStructure = (table: DbTable, strings: any): Structure => {
    switch (table) {
        case DbTable.BODIES:
            return {
                levels: [
                    {
                        columns: Col.list<Star>([
                            { name: 'type', format: (val, item) => <Properties item={item} render={(name, type) => <ItemImage image={`Database/Star/${type.spectral_class || 'Unknown'}.svg`} large={true} />} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Properties item={item} render={name => <Detail pathname='/abc' title={name} subtitle={<StarType star={item} strings={strings} />} />} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '☉', multi: 'properties' },
                            { name: 'mass', unit: '☉', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: 'K', multi: 'properties' },
                            { name: 'distance', unit: 'ly', multi: 'properties' },
                            { name: 'luminosity', unit: '☉', multi: 'properties' },
                            { name: 'transit_depth', format: (_, item) => <MiniGraph data={item.light_curves[0].flux} color='#FAA' />, title: <Colored color='#FAA'>{strings.properties.lightCurve}</Colored>, width: '20rem' },
                            { name: 'planets', format: (val, item) => item.planets.length },
                            { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'absolute_magnitude', format: Numbers.format, multi: 'properties' },
                            { name: 'apparent_magnitude', format: Numbers.format, multi: 'properties' },
                            { name: 'metallicity', format: Numbers.format, multi: 'properties' },
                            { name: 'dataset', format: (_, item) => (
                                    <>
                                        <MultiValue items={item.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Dataset/StarProperties.svg' />} />
                                        <MultiValue items={item.light_curves} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Dataset/TargetPixel.svg' />} />
                                    </>
                                ), width: 1.5 }
                        ], strings)
                    },
                    {
                        columns: Col.list<Planet>([
                            { name: 'type', format: (val, item) => item.properties && item.properties[0] && <ItemImage image={`Database/Planet/${pascalCase(item.properties[0].type || 'Unknown')}.png`} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => item.properties && item.properties[0] && <Detail pathname='/abc' title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type] || strings.planets.unknownType} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '⊕', multi: 'properties' },
                            { name: 'mass', unit: '⊕', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: '°C', multi: 'properties' },
                            { name: 'semi_major_axis', unit: 'au', multi: 'properties' },
                            { name: 'orbital_period', format: val => Dates.formatDistance(strings, Dates.daysToMs(val), 0, Dates.Format.EXACT), multi: 'properties' },
                            { name: 'transit_depth', format: (_, planet) => <MiniGraph data={planet.properties[0].transit!.flux} color='#AFA' />, title: <Colored color='#AFA'>{strings.properties.transit}</Colored>, width: '20rem' },
                            { name: 'life_conditions', format: val => strings.planets.lifeConditions[val], styleMap: lifeTypeStyle, multi: 'properties' },
                            { name: 'surface_gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                            { name: 'status', format: value => strings.planets.statuses[value], styleMap: planetStatusStyle },
                            { name: 'todo' },
                            { name: 'dataset', format: (val, planet, i) => <IconText text={val} icon={`/img/Database/Dataset/${(planet as any).processed ? 'TargetPixel' : 'PlanetProperties'}.svg`} />, width: 1.5, multi: 'properties' }
                        ], strings),
                        accessor: (star: any) => star.planets || []
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.STARS:
            return {
                levels: [
                    {
                        columns: Col.list<Star>([
                            { name: 'type', format: (val, item) => <ItemImage image={`Database/Star/${item.properties[0].type.spectral_class}.svg`} large={true} />, width: '5rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Detail pathname='/abc' title={item.properties[0].name} subtitle={<StarType star={item} strings={strings}/>} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '☉', multi: 'properties' },
                            { name: 'mass', unit: '☉', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: 'K', multi: 'properties' },
                            { name: 'distance', unit: 'ly', multi: 'properties' },
                            { name: 'luminosity', unit: '☉', multi: 'properties' },
                            { name: 'gravity', unit: <Fraction top='m' bottom={<>s<sup>2</sup></>}/>, multi: 'properties' },
                            { name: 'planets', format: (val, item) => item.planets.length },
                            { name: 'transit_depth', format: () => <MiniGraph data={dd} color='#FAA' />, title: <Colored color='#FAA'>{strings.properties.lightCurve}</Colored>, width: '20rem' },
                            { name: 'dataset', format: val => <IconText text={val} icon='/img/Database/Dataset/StarProperties.svg' />, width: 1.5, multi: 'properties' }
                        ], strings)
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.PLANETS:
            return {
                levels: [
                    {
                        columns: Col.list<Planet>([
                            { name: 'type', format: (val, item) => <ItemImage image={`Database/Planet/${pascalCase(item.properties[0].type)}.png`} />, width: '4rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Detail pathname='/abc' title={item.properties[0].name} subtitle={strings.planets.types[item.properties[0].type]} />, width: 1.5, headerIcon: false },
                            { name: 'diameter', unit: '⊕', multi: 'properties' },
                            { name: 'mass', unit: '⊕', multi: 'properties' },
                            { name: 'density', unit: <Fraction top='kg' bottom={<>m<sup>3</sup></>}/>, multi: 'properties' },
                            { name: 'surface_temperature', unit: '°C', multi: 'properties' },
                            { name: 'semi_major_axis', unit: 'au', multi: 'properties' },
                            { name: 'orbital_period', format: val => Dates.formatDistance(strings, Dates.daysToMs(val), 0, Dates.Format.EXACT), multi: 'properties' },
                            { name: 'orbital_velocity', unit: <Fraction top='km' bottom='s' />, multi: 'properties' },
                            { name: 'life_conditions', format: val => strings.planets.lifeConditions[val], styleMap: lifeTypeStyle, multi: 'properties' },
                            { name: 'distance', format: val => '4.2 ly' },
                            { name: 'transit_depth', format: () => <MiniGraph data={dd3} color='#AFA' />, title: <Colored color='#AFA'>{strings.properties.transit}</Colored>, width: '20rem' },
                            { name: 'dataset', format: val => <IconText text={val} icon='/img/Database/Dataset/PlanetProperties.svg' />, width: 1.5, multi: 'properties' }
                        ], strings)
                    }
                ],
                getter: getPlanets,
                rowHeight: () => 96
            }
        case DbTable.DATASETS:
            return {
                levels: [
                    {
                        columns: Col.list<Dataset>([
                            { name: 'type', format: val => <ItemImage image={`Database/Dataset/${pascalCase(val)}.svg`} />, width: '4rem', headerIcon: false },
                            { name: 'name', format: (val, item) => <Detail pathname='/abc' title={val} subtitle={strings.datasets.types[item.type]} />, width: 1.5, headerIcon: false },
                            { name: 'total_size', format: Numbers.format },
                            { name: 'processed', format: (val, item) => <ProgressBar range={item.total_size} value={item.total_size - item.current_size} label={prettyBytes(item.processed || 0)} title={`${Numbers.format(item.total_size - item.current_size)} / ${Numbers.format(item.total_size)}`} /> },
                            { name: 'time', format: val => Dates.formatDistance(strings, 0, val, Dates.Format.LONG) },
                            { name: 'created', format: val => <DateTime s={val} />, title: strings.properties.published },
                            { name: 'modified', format: val => Dates.formatDistance(strings, val) },
                            { name: 'priority', format: val => strings.datasets.priorities[val - 1], styleMap: priorityStyle },
                            { name: 'url', format: (val, item) => <OptionalLine lines={[Url.parse(item.items_getter || '').hostname, Url.parse(item.item_getter || '').hostname]} />, width: 2 }
                        ], strings)
                    }
                ],
                getter: getDatasets,
                rowHeight: () => 72
            }
    }

    return null as any
}

interface Colored {
    color: string
}

const Colored = Styled.span<Colored>`
    color: ${props => props.color};
    `

interface ItemImageProps {
    large?: boolean
    image: string
}

const ItemImage = Styled.div<ItemImageProps>`
    ${props => size(props.large ? '4rem' : '2.5rem')}
    ${props => image(props.image)}
    display: inline - block
`

// 622 601, 548, 601, 523, 463, 456, 367, 228, 277