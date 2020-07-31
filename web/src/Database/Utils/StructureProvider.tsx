import React from 'react'
import Styled from 'styled-components'
import Url from 'url'
import prettyBytes from 'pretty-bytes'
import { pascalCase } from 'change-case'

import DbTable from '../Constants/DbTable'
import { Cursor, Fraction, IconText, Level, ProgressBar } from '../../Layout'
import { MiniGraph } from '../../Stats'
import { Duration, image, size } from '../../Style'
import ItemControls from '../Components/ItemControls'
import { Link } from '../../Routing'
import { getDatasets, getStars, getPlanets } from '../Redux/Slice'
import { Dates, Numbers } from '../../Native'

const dd = [0.99742, 1.00001, 1.00002, 1.00003, 1.00005, 1.00001, 0.99996, 1.0, 1.00001, 1.00004, 0.99993, 0.99886, 0.99744, 0.99997, 1.00001, 1.00003, 1.00002, 0.99998, 0.99992, 1.00002, 1.00004, 1.00005, 0.99999, 0.99911, 0.99723, 0.99995, 1.00002, 1.00002, 1.00002, 0.99999, 0.99995, 0.99998, 1.00003, 1.00004, 1.00001, 0.99879, 0.99766, 0.99992, 0.99998, 0.99999, 1.00002, 1.00001, 0.99998, 1.00002, 1.00004, 1.00002, 0.99999, 0.99885, 0.99751, 0.99995, 0.99998, 1.00002, 1.0, 0.99997, 0.99992, 1.00003, 1.00018, 1.00004, 1.00001, 0.99903, 0.99728, 0.99993, 1.0, 1.00005, 1.00003, 0.99997, 0.99989, 0.99999, 1.00001, 1.00002, 1.0, 0.99997, 1.0, 1.00002, 1.00001, 0.99995, 0.99875, 0.99755, 0.99998, 1.0, 1.00004, 1.00002, 0.99997, 0.99994, 1.00002, 1.00005, 1.00003, 0.99997, 0.99899, 0.99767, 0.99995, 0.99998, 1.00002, 1.00003, 0.99999, 0.99996, 1.00001, 1.00002, 1.00002, 0.99999, 0.99869, 0.99779, 0.99997, 1.0, 1.00001, 1.00004, 1.0, 0.99996, 0.99999, 1.00001, 1.00002, 0.99997, 0.99872, 0.99759, 0.99998, 1.0, 1.0, 1.00001, 0.99999, 0.99998, 1.00001, 1.00005, 1.00002, 0.99997, 0.9989, 0.99771, 0.99996, 1.0, 1.00003, 1.00003, 0.99998, 0.99994, 1.00001, 1.00003, 1.00004, 0.99996, 0.99848, 0.99787, 0.99995, 0.99998, 1.00002, 1.00003, 0.99999, 0.99997, 1.00003, 1.00004, 1.00002, 0.99997, 0.99844, 0.99766, 0.99996, 1.00001, 1.00001, 1.00002, 0.99998, 0.99994, 1.00001, 1.00004, 1.00002, 0.99997, 0.99885, 0.99777, 0.99996, 1.0, 1.00003, 1.00005, 0.99998, 0.99996, 1.0, 1.0, 1.00002, 0.99996, 0.99842, 0.99789, 0.99995, 0.99998, 1.00002, 1.00005, 0.99998, 0.99997, 1.00002, 1.00002, 1.00002, 0.99995, 0.99861, 0.99774, 0.99997, 1.00002, 1.00004, 1.00002, 0.99997, 0.99994, 1.00002, 1.00005, 1.00004, 0.99996, 0.9988, 0.9978, 0.99993, 1.00001, 1.00005, 1.00003, 0.99998, 0.99998, 1.00004, 1.00001, 0.99999, 0.99998, 0.99885, 0.99797, 0.99996, 1.0, 0.99992, 1.00001, 0.99993, 0.99998, 1.00002, 1.00003, 1.00003, 1.00005, 0.99851, 0.99777, 0.99997, 1.00001, 1.00002, 1.00002, 0.99999, 0.99995, 1.0, 1.00003, 1.0, 1.0, 0.99832, 0.99824, 0.99996, 0.99998, 1.00003, 1.00002, 0.99996, 0.99997, 1.00003, 1.00003, 1.00002, 0.99995, 0.9983, 0.99802, 0.99996, 1.00002, 1.00005, 1.00003, 1.00002, 0.99996, 0.99999, 1.00003, 1.0, 0.99997, 0.99846, 0.99786, 0.99998, 0.99999, 1.00003, 1.00002, 0.99998, 0.99996, 1.00005, 1.00006, 1.00002, 0.99994, 0.99824, 0.99798, 0.99996, 1.00002, 1.00004, 1.00004, 0.99992, 0.99994, 0.99998, 1.00001, 1.00002, 0.99998, 0.99826, 0.9981, 0.99995, 1.0, 1.00002, 1.00004, 1.00002, 1.00001, 1.00005, 1.00003, 0.99997, 0.99994, 0.99844, 0.99812, 0.99999, 1.00007, 0.99998, 0.99843, 0.99819, 0.99997, 1.00001, 1.00002, 1.00001, 0.99997, 0.99996, 1.00001, 1.00002, 0.99999, 0.99993, 0.99793, 0.99839, 0.99998, 1.00006, 1.00003, 1.00002, 0.99996, 0.99996, 1.0, 1.00003, 1.00001, 0.99995, 0.99813, 0.99818, 0.99997, 1.00001, 1.00004, 1.00005, 1.00001, 0.99997, 1.00001, 1.00001, 0.99998, 0.99994, 0.99807, 0.99826, 1.0, 1.00001, 1.00002, 1.00001, 0.99997, 0.99999, 1.00002, 1.00002, 1.0, 0.99992, 0.99782, 0.99844, 0.99998, 1.00004, 1.00007, 1.00002, 0.99997, 0.99996, 0.99998, 0.99999, 1.00001, 0.99999, 0.9981, 0.99827, 0.99999, 1.00001, 1.00003, 1.00005, 1.00003, 1.00001, 1.00002, 1.0, 0.99997, 0.99994, 0.99788, 0.99865, 1.00002, 1.00004, 1.00002, 1.00001, 0.99992, 0.99991, 1.00003, 1.0, 0.99807, 0.99831, 0.99998, 1.00002, 1.0, 1.00002, 0.99998, 0.99997, 1.00001, 1.00003, 1.0, 0.99994, 0.99777, 0.99876, 1.0, 1.00002, 1.00003, 1.00001, 0.99994, 0.99996, 1.00001, 1.00003, 1.00001, 0.99992, 0.99772, 0.99855, 0.99997, 1.00002, 1.00006, 1.00006, 0.99996, 0.99995, 1.0, 1.00001, 0.99998, 0.99995, 0.99799, 0.99838, 0.99999, 1.00001, 1.00002, 1.00003, 1.0, 1.00001, 1.00002, 1.00002, 0.99998, 0.99993, 0.99752, 0.9988, 1.00002, 1.00003, 1.00005, 1.0, 1.00049, 0.99996, 1.00001, 1.00002, 1.00002, 0.99996, 0.99768, 0.99861, 0.99997, 1.0, 1.00003, 1.00004, 0.99998, 1.0, 1.00001, 1.00003, 0.99998, 0.99992, 0.99789, 0.99862, 1.0, 1.00002, 1.00004, 1.00001, 0.99994, 0.99998, 1.00001, 1.00003, 0.99998, 0.99994, 0.99745, 0.99885, 0.99998, 1.00003, 1.00004, 1.00003, 0.99995, 0.99998, 1.00002, 1.00002, 0.99997, 0.99992, 0.9973, 0.99865, 0.99999, 1.00003, 1.00004, 1.00003, 0.99996, 0.99996, 1.0, 1.00002, 0.99999, 0.99989, 0.99787, 0.99882, 1.0001, 1.00009, 1.00002, 1.00005, 0.99997, 0.99996, 0.99998, 1.0, 0.99998, 0.99993, 0.99742, 0.99893, 1.00001, 1.00002, 1.00003, 1.0, 0.99996, 0.99998, 1.0, 1.00001, 0.99996, 0.9999, 0.99759, 0.9987, 1.0, 1.00005, 1.00005, 1.00004, 0.99996, 0.99994, 1.0, 1.00001, 1.0, 0.99992, 0.99782, 0.99871, 0.99999, 1.00002, 1.00004, 1.00004, 1.0, 1.00001, 1.00001, 1.0, 0.99998, 0.99994, 0.99736, 0.99897, 1.00001, 1.00004, 1.00002, 1.0, 0.99994, 0.99997, 1.00002, 1.00003, 0.99999, 0.99991, 0.99754, 0.99874, 0.99998, 1.00002, 1.00009, 1.00007, 0.99996, 0.99998, 1.00001, 1.00001, 0.99999, 0.99996, 0.99752, 0.9992, 0.99999, 1.00002, 1.00002, 1.00003, 0.99998, 1.00001, 1.00003, 1.00001, 0.99997, 0.99991, 0.99732, 0.99902, 1.00002, 1.00005, 1.00005, 1.00001, 0.99994, 0.99996, 0.99998, 1.00002, 0.99999, 0.99991, 0.9975, 0.99881, 0.99998, 1.00003, 1.00005, 1.00006, 0.99998, 0.99997, 0.99999, 1.00001, 0.99999, 0.99995, 0.99771, 0.99926, 1.0, 1.00002, 1.00002, 1.00003, 0.99996, 0.99997, 1.00003, 1.00001, 0.99997, 0.99988, 0.99726, 0.99906, 1.0, 1.00005, 1.00004, 1.00001, 0.99996, 0.99997, 1.00002, 1.0, 1.0, 0.99992, 0.99745, 0.999, 1.0, 1.00004, 1.00005, 1.00004, 0.99996, 0.99998, 1.0, 0.99999]
const dd2 = [0.99989, 0.99992, 0.99996, 0.99996, 0.99999, 1.00004, 0.99999, 1.00004, 1.00008, 1.00004, 1.00003, 1.00007, 0.99997, 1.00004, 1.00003, 1.00001, 1.00006, 1.00003, 0.99999, 1.00006, 1.00001, 0.99997, 0.99995, 0.99982, 0.99995, 0.99994, 0.99993, 0.99996, 0.99999, 0.99993, 1.00006, 1.00003, 1.00008, 1.00006, 1.00006, 1.0, 1.00008, 1.00002, 0.99999, 1.00001, 0.99992, 0.99996, 0.99998, 0.99998, 0.99996, 0.99998, 0.99992, 1.00004, 1.00005, 1.00006, 1.00001, 1.00002, 0.99998, 1.00003, 1.00002, 0.99999, 1.00015, 0.99991, 0.99992, 0.99998, 0.99997, 0.99997, 1.00003, 0.99996, 1.00005, 1.00006, 1.00021, 1.00024, 1.00023, 1.00027, 1.00028, 1.00029, 1.00028, 1.0002, 1.00024, 1.00025, 1.00026, 1.00024, 1.00026, 1.00011, 1.00022, 1.00016, 1.00016, 1.00012, 1.00006, 0.99999, 1.00004, 1.00004, 1.00002, 0.99999, 0.99991, 1.00001, 1.0, 0.99995, 0.99993, 0.99991, 0.99978, 0.99982, 0.99982, 0.99975, 0.99969, 0.99965, 0.9996, 0.99967, 0.99963, 0.9996, 0.9996, 0.9995, 0.99955, 0.99953, 0.99956, 0.99961, 0.99965, 0.99955, 0.9998, 0.99967, 0.99951, 0.99992, 1.00006, 0.99993, 1.0, 0.99999, 1.00004, 0.99997, 0.99995, 0.99993, 0.99997, 1.00003, 1.00004, 1.00004, 0.99994, 1.00004, 1.00008, 1.00004, 1.0, 1.00006, 0.99994, 1.00005, 1.00006, 1.00001, 1.00001, 1.00001, 0.99992, 0.99995, 0.99998, 1.0, 1.00002, 0.99992, 1.00005, 1.00011, 1.00009, 1.00007, 1.00005, 0.99997, 1.00002, 1.0, 1.00004, 0.99997, 1.00003, 0.99988, 1.00001, 0.99996, 0.99996, 1.00002, 0.9999, 0.99997, 0.99997, 0.99998, 1.00003, 1.00003, 1.0, 1.00006, 1.00005, 1.00003, 1.0, 1.00001, 0.99994, 1.00001, 0.99999, 1.00001, 0.99998, 0.99991, 1.00004, 0.99997, 0.99999, 1.00004, 0.99999, 0.9999, 0.99997, 1.00004, 1.00006, 1.00006, 1.00003, 1.00012, 1.0, 1.00005, 1.00006, 1.0, 0.99995, 0.99995, 0.99995, 0.99995, 0.99994, 1.0, 0.99994, 1.0, 1.00004, 1.00001, 1.00003, 1.00006, 0.99999, 1.00009, 1.00008, 1.00006, 1.00005, 1.00003, 0.99998, 1.00002, 1.00002, 1.00003, 1.0, 0.99996, 0.99999, 0.99996, 1.00001, 0.99995, 0.99996, 0.99986, 0.99995, 0.99996, 1.00006, 1.00008, 1.00006, 1.00001, 1.00003, 1.0, 1.00005, 1.0, 0.99994, 1.0, 0.99998, 0.99997, 0.99998, 1.0, 0.9999, 0.99999, 0.99999, 0.99998, 0.99999, 1.00001, 0.99993, 1.00005, 1.00008, 1.00004, 1.00006, 0.99999, 0.99996, 1.00002, 1.00001, 0.99997, 1.0, 0.99994, 1.00001, 1.00004, 1.00005, 1.00006, 1.00003, 0.99998, 1.00001, 1.00002, 1.00005, 1.00006, 1.00001, 0.99998, 1.00001, 1.00001, 0.99999, 1.0, 0.99992, 0.99998, 0.99995, 0.99997, 0.99997, 0.99999, 0.99993, 0.99999, 0.99991, 0.99993, 0.99997, 1.00019, 0.99999, 1.00002, 1.00009, 1.00006, 1.00008, 1.00006, 1.00021, 1.00022, 1.00009, 1.00006, 1.00004, 1.00002, 1.00003, 0.99999, 0.99984, 0.99996, 0.99995, 0.99996, 0.99993, 0.99995, 0.99987, 0.99996, 0.99999, 0.99994, 0.99991, 0.99991, 0.99987, 0.99991, 0.99996, 1.0, 1.0, 0.99991, 0.99996, 0.99998, 1.0, 1.0, 1.00005, 0.99993, 1.00002, 1.0, 1.0, 1.00003, 1.00001, 0.99996, 1.00005, 1.00005, 1.00005, 1.00002, 1.00002, 0.99999, 1.00001, 1.00001, 1.0, 1.00001, 0.99995, 1.00006, 1.00001, 1.00003, 1.00006, 1.00007, 0.99996, 1.00008, 1.00005, 1.00007, 1.00006, 0.99996, 0.99993, 0.99998, 0.99994, 0.99994, 0.99991, 0.99981, 0.99995, 0.9999, 0.99998, 0.99996, 0.99998, 0.99994, 1.00004, 1.00003, 1.0, 1.00006, 1.00001, 0.99998, 1.00007, 1.00007, 1.00005, 1.00111, 1.00056, 1.00001, 1.00007, 1.00009, 1.00017, 1.0001, 1.00013, 1.00019, 1.00023, 1.00009, 1.00002, 0.99984, 0.99975, 0.99969, 0.99986, 0.99989, 1.00003, 1.00012, 1.00006, 1.00008, 0.99999, 0.99998, 1.00001, 1.0, 1.0, 0.99997, 0.99991, 1.00002, 1.00003, 1.0, 0.99996, 0.99997, 0.99986, 0.99992, 0.99993, 0.99992, 0.99992, 0.99989, 0.99989, 0.99999, 0.99995, 1.0, 1.0, 0.99993, 0.99999, 1.00005, 1.00002, 1.00005, 1.00003, 0.99998, 1.0, 1.00003, 1.00003, 1.00005, 1.0, 0.99997, 0.99998, 1.00001, 0.99998, 1.00005, 0.99995, 1.00003, 1.00007, 1.00008, 1.00007, 1.00003, 0.99994, 1.00004, 1.00002, 1.00003, 1.00002, 0.99995, 0.99991, 0.99997, 0.99998, 0.99995, 0.99997, 0.99994, 0.99995, 0.99999, 1.0, 1.00004, 1.00002, 0.99996, 1.00006, 1.00003, 1.00007, 1.00002, 1.00002, 0.99995, 1.00002, 1.00004, 1.00001, 1.00001, 0.99991, 0.99995, 0.99997, 0.99999, 0.99998, 0.99999, 0.99995, 1.00001, 0.99999, 1.0, 1.00004, 1.00006, 0.99993, 1.00003, 0.99998, 0.99999, 1.00002, 0.99999, 0.99991, 1.00004, 1.00002, 1.00005, 1.00001, 0.99993, 1.00001, 1.00005, 1.00002, 1.00004, 1.00005, 0.99998, 1.00004, 1.00005, 1.00004, 1.00008, 1.0, 0.99996, 0.99998, 1.00002, 1.00006, 1.00002, 0.99995, 0.99995, 0.99998, 1.0, 1.0, 1.00002, 0.99995, 1.00002, 1.0, 1.0, 1.00002, 1.00001, 0.99992, 1.0, 1.00004, 1.00003, 1.00006, 0.9999, 0.99995, 0.99996, 0.99996, 0.99996, 0.99999, 0.99991, 1.00002, 0.99998, 0.99998, 1.0, 0.99999, 0.99996, 1.00004, 1.00005, 1.00004, 1.00004, 0.99995, 1.0, 1.00006, 1.0001, 1.0, 1.0, 0.99992, 1.00004, 1.0, 1.00002, 1.00003, 1.00002, 0.99996, 1.00003, 1.00002, 1.00004, 1.00004, 1.0, 0.99994, 1.00002, 1.00004, 1.00004, 1.0, 0.99991, 0.99999, 1.00001, 1.00001, 1.0, 1.00002, 0.99994, 0.99998, 1.00002, 1.00001, 1.00003, 1.00001, 0.99994, 1.0, 1.00001, 1.00001, 1.00001, 0.99993, 0.99998, 1.0, 0.99999, 1.00003, 1.00002, 0.99991, 1.00001, 0.99997, 0.99999, 1.00001, 1.0, 0.99994, 1.00001, 1.00004, 1.00003, 1.00004, 1.0, 1.00004, 1.00004, 1.0, 1.00002, 1.00002, 0.99991, 1.0, 0.99999, 1.0, 0.99997, 0.99997, 0.99988, 1.00001, 1.00002, 1.00004, 1.00004, 0.99999, 1.0, 1.00005, 1.00005, 1.00006, 1.00004, 0.99997, 1.00008, 1.00006]

export const Detail = Styled(Link)`
    ${size()}
    align-items: center;
    display: flex;

    &:after {   
        ${image('Controls/ArrowRight.svg', '80%')}
        ${size('1rem')}
        content: "";
        display: inline-block;
        margin-left: 0.5rem;
        opacity: 0.8;
        vertical-align: middle;
        transition: transform ${Duration.MEDIUM}, opacity ${Duration.MEDIUM};
    }
`

const SpectralClassRoot = Styled.div`
    display: inline-block;
    font-weight: bold;
`

const SpectralClass = ({ temperature }: { temperature: number }) => (
    <SpectralClassRoot style={{ color: `#A00` }}>
        O
    </SpectralClassRoot>
)

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

const MultiValue = ({ items, property, formatter = val => val }: { items: any[], property: string, formatter?: (val: any) => any }) => (
    <div>
        {items.filter(item => !!item[property]).map(item => <div title={'Dataset: ' + item.dataset}>{formatter(item[property])}</div>)}
    </div>
)

const priorityColor = ['#666', '#888', '#EEE', '#EAA', '#F55']

const Priority = ({ value, label }: { value: number, label: string }) => (
    <div style={{ fontWeight: value > 3 ? 'bold' : undefined, color: priorityColor[value - 1] }}>
        {label}
    </div>
)

// TODO: Hooks instaed providers?
// TODO: Root strings in parameter.
export const provideFilterColumns = (table: DbTable, strings: any): [string, string][] => {
    switch (table) {
        case DbTable.BODIES:
            return []
        case DbTable.STARS:
            return []
        case DbTable.PLANETS:
            return []
        case DbTable.DATASETS:
            return [
                ['name', strings.name],
                ['type', strings.type],
                ['total_size', strings.objects],
                ['processed', strings.processed],
                ['time', strings.processTime],
                ['created', strings.published],
                ['modified', strings.lastActivity],
                ['priority', strings.priority],
                ['url', strings.url]
            ]
    }

    return []
}

type Structure = {
    levels: Level[]
    getter: (cursor: Cursor) => void
    rowHeight: (row: number, level: number) => number
}

export const provideStructure = (table: DbTable, strings: any): Structure => {
    switch (table) {
        case DbTable.BODIES:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            {
                                title: strings.properties.type,
                                accessor: star => star.type,
                                render: (type, star, i) => <ItemImage image={`Database/Star/${['O', 'B', 'A', 'F', 'G', 'K', 'M'][i % 7]}.svg`} large={true} />,
                                width: '5rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: star => star.properties[0].name,
                                render: (name, star) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>{strings.stars.types.YELLOW_DWARF}</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.diameter,
                                accessor: star => star.properties[0].diameter,
                                render: (diameter, star) => <MultiValue items={star.properties} property='diameter' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Diameter.svg'
                            },
                            {
                                title: strings.properties.mass,
                                accessor: star => star.properties[0].mass,
                                render: (mass, star) => <MultiValue items={star.properties} property='mass' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Mass.svg'
                            },
                            {
                                title: strings.properties.temperature,
                                accessor: star => star.properties[0].temperature,
                                render: (_, star) => <MultiValue items={star.properties} property='temperature' formatter={val => <>{Numbers.format(val)} K (<SpectralClass temperature={val} />)</>} />,
                                headerIcon: '/img/Database/Table/Temperature.svg'
                            },
                            {
                                title: strings.properties.density,
                                accessor: star => star.properties[0].density,
                                render: (_, star) => <MultiValue items={star.properties} property='density' formatter={val => <>{Numbers.format(val)} <Fraction top='kg' bottom={<>m<sup>3</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Density.svg'
                            },
                            {
                                title: strings.properties.luminosity,
                                accessor: star => star.properties[0].luminosity,
                                render: (_, star) => <MultiValue items={star.properties} property='luminosity' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Luminosity.svg'
                            },
                            {
                                title: strings.properties.distance,
                                accessor: star => star.properties[0].distance,
                                render: (_, star) => <MultiValue items={star.properties} property='distance' formatter={val => Numbers.format(val) + ' ly'} />,
                                headerIcon: '/img/Database/Table/Distance.svg'
                            },
                            {
                                title: strings.properties.gravity,
                                accessor: star => star.properties[0].gravity,
                                render: (_, star) => <MultiValue items={star.properties} property='gravity' formatter={val => <>{Numbers.format(val)} <Fraction top='m' bottom={<>s<sup>2</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Gravity.svg'
                            },
                            {
                                title: strings.properties.planets,
                                accessor: star => star.planets,
                                render: () => 3,
                                headerIcon: '/img/Database/Table/Planet.svg'
                            },
                            {
                                title: <Colored color='#FAA'>Světelná křivka</Colored>,
                                accessor: () => '',
                                render: (_, __, i) => <MiniGraph data={i % 2 ? dd : dd2} />,
                                headerIcon: '/img/Database/Table/Discovery.svg',
                                width: '20rem'
                            },
                            {
                                title: strings.properties.datasets,
                                accessor: star => star.properties.length, // TODO: Light curve
                                render: (_, star) => (
                                    <>
                                        <MultiValue items={star.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Star/G.svg' />} />
                                    </>
                                ),
                                headerIcon: '/img/Database/Table/Datasets.svg',
                                width: 1.5
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
                    },
                    {
                        columns: [
                            { title: '', accessor: (planet, i) => i + 1, width: '3rem' },
                            {
                                title: strings.properties.type,
                                accessor: planet => planet.properties[0].type,
                                render: (type, planet, i) => <ItemImage image={`Database/Planet/${['Terrestrial', 'Gas'][1 - i % 2]}.png`} />,
                                width: '4rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: planet => planet.properties[0].name,
                                render: (name, planet) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>Plynný obr</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.diameter,
                                accessor: planet => planet.properties[0].diameter,
                                render: (diameter, planet) => <MultiValue items={planet.properties} property='diameter' formatter={val => Numbers.format(val) + ' ⊕'} />,
                                headerIcon: '/img/Database/Table/Diameter.svg'
                            },
                            {
                                title: strings.properties.mass,
                                accessor: planet => planet.properties[0].mass,
                                render: (mass, planet) => <MultiValue items={planet.properties} property='mass' formatter={val => Numbers.format(val) + ' ⊕'} />,
                                headerIcon: '/img/Database/Table/Mass.svg'
                            },
                            {
                                title: 'Teplota',
                                accessor: (planet: any) => planet.surface_temperature,
                                render: (_, planet) => <MultiValue items={planet.properties} property='surface_temperature' formatter={val => Numbers.format(val) + ' °C'} />,
                                headerIcon: '/img/Database/Table/Temperature.svg'
                            },
                            {
                                title: strings.properties.density,
                                accessor: planet => planet.properties[0].density,
                                render: (_, planet) => <MultiValue items={planet.properties} property='density' formatter={val => <>{Numbers.format(val)} <Fraction top='kg' bottom={<>m<sup>3</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Density.svg'
                            },
                            {
                                title: strings.properties.semiMajorAxis,
                                accessor: planet => planet.properties[0].semi_major_axis,
                                render: (_, planet) => <MultiValue items={planet.properties} property='semi_major_axis' formatter={val => Numbers.format(val) + ' au'} />,
                                headerIcon: '/img/Database/Table/Orbit.svg'
                            },
                            {
                                title: 'Perioda',
                                accessor: (planet: any) => planet.orbital_period,
                                render: (_, planet) => <MultiValue items={planet.properties} property='orbital_period' formatter={val => Numbers.format(val) + ' d'} />,
                                headerIcon: '/img/Database/Table/Period.svg'
                            },
                            {
                                title: 'Rychlost',
                                accessor: (planet: any) => planet.properties[0].orbital_velocity,
                                render: (_, planet) => <MultiValue items={planet.properties} property='orbital_velocity' formatter={val => <>{Numbers.format(val)} <Fraction top='km' bottom='s' /></>} />,
                                headerIcon: '/img/Database/Table/Velocity.svg'
                            },
                            { title: 'Život', accessor: () => 'Vyloučen', headerIcon: '/img/Database/Table/Life.svg' },
                            {
                                title: <Colored color='#AFA'>{strings.properties.transit}</Colored>,
                                accessor: () => '',
                                render: (_, __, i) => <MiniGraph data={i % 2 ? dd : dd2} color='#AFA' />,
                                headerIcon: '/img/Database/Table/Discovery.svg',
                                width: '20rem'
                            },
                            {
                                title: strings.properties.datasets,
                                accessor: planet => planet.properties.length,
                                render: (_, planet) => (
                                    <>
                                        <MultiValue items={planet.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Star/G.svg' />} />
                                    </>
                                ),
                                headerIcon: '/img/Database/Table/Datasets.svg',
                                width: 1.5
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ],
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
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            {
                                title: strings.properties.type,
                                accessor: dataset => dataset.type,
                                render: (type, star, i) => <ItemImage image={`Database/Star/${['O', 'B', 'A', 'F', 'G', 'K', 'M'][i % 7]}.svg`} large={true} />,
                                width: '5rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: star => star.properties[0].name,
                                render: (name, star) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>{strings.stars.types.YELLOW_DWARF}</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.diameter,
                                accessor: star => star.properties[0].diameter,
                                render: (diameter, star) => <MultiValue items={star.properties} property='diameter' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Diameter.svg'
                            },
                            {
                                title: strings.properties.mass,
                                accessor: star => star.properties[0].mass,
                                render: (mass, star) => <MultiValue items={star.properties} property='mass' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Mass.svg'
                            },
                            {
                                title: strings.properties.temperature,
                                accessor: star => star.properties[0].temperature,
                                render: (_, star) => <MultiValue items={star.properties} property='temperature' formatter={val => <>{Numbers.format(val)} K (<SpectralClass temperature={val} />)</>} />,
                                headerIcon: '/img/Database/Table/Temperature.svg'
                            },
                            {
                                title: strings.properties.luminosity,
                                accessor: star => star.properties[0].luminosity,
                                render: (_, star) => <MultiValue items={star.properties} property='luminosity' formatter={val => Numbers.format(val) + ' ☉'} />,
                                headerIcon: '/img/Database/Table/Luminosity.svg'
                            },
                            {
                                title: strings.properties.density,
                                accessor: star => star.properties[0].density,
                                render: (_, star) => <MultiValue items={star.properties} property='density' formatter={val => <>{Numbers.format(val)} <Fraction top='kg' bottom={<>m<sup>3</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Density.svg'
                            },
                            {
                                title: strings.properties.distance,
                                accessor: star => star.properties[0].distance,
                                render: (_, star) => <MultiValue items={star.properties} property='distance' formatter={val => Numbers.format(val) + ' ly'} />,
                                headerIcon: '/img/Database/Table/Distance.svg'
                            },
                            {
                                title: strings.properties.gravity,
                                accessor: star => star.properties[0].gravity,
                                render: (_, star) => <MultiValue items={star.properties} property='gravity' formatter={val => <>{Numbers.format(val)} <Fraction top='m' bottom={<>s<sup>2</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Gravity.svg'
                            },
                            {
                                title: strings.properties.planets,
                                accessor: star => star.planets,
                                render: () => 3,
                                headerIcon: '/img/Database/Table/Planet.svg'
                            },
                            {
                                title: <Colored color='#FAA'>Světelná křivka</Colored>,
                                accessor: () => '',
                                render: (_, __, i) => <MiniGraph data={i % 2 ? dd : dd2} />,
                                headerIcon: '/img/Database/Table/Discovery.svg',
                                width: '20rem'
                            },
                            {
                                title: strings.properties.datasets,
                                accessor: star => star.properties.length, // TODO: Light curve
                                render: (_, star) => (
                                    <>
                                        <MultiValue items={star.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Star/G.svg' />} />
                                    </>
                                ),
                                headerIcon: '/img/Database/Table/Datasets.svg',
                                width: 1.5
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
                    }
                ],
                getter: getStars,
                rowHeight: () => 96
            }
        case DbTable.PLANETS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (planet, i) => i + 1, width: '3rem' },
                            {
                                title: strings.properties.type,
                                accessor: planet => planet.properties[0].type,
                                render: (type, planet, i) => <ItemImage image={`Database/Planet/${['Terrestrial', 'Gas'][1 - i % 2]}.png`} />,
                                width: '4rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: planet => planet.properties[0].name,
                                render: (name, planet) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>Plynný obr</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.diameter,
                                accessor: planet => planet.properties[0].diameter,
                                render: (diameter, planet) => <MultiValue items={planet.properties} property='diameter' formatter={val => Numbers.format(val) + ' ⊕'} />,
                                headerIcon: '/img/Database/Table/Diameter.svg'
                            },
                            {
                                title: strings.properties.mass,
                                accessor: planet => planet.properties[0].mass,
                                render: (mass, planet) => <MultiValue items={planet.properties} property='mass' formatter={val => Numbers.format(val) + ' ⊕'} />,
                                headerIcon: '/img/Database/Table/Mass.svg'
                            },
                            {
                                title: strings.properties.density,
                                accessor: planet => planet.properties[0].density,
                                render: (_, planet) => <MultiValue items={planet.properties} property='density' formatter={val => <>{Numbers.format(val)} <Fraction top='kg' bottom={<>m<sup>3</sup></>}/></>} />,
                                headerIcon: '/img/Database/Table/Density.svg'
                            },
                            {
                                title: strings.properties.semiMajorAxis,
                                accessor: planet => planet.properties[0].semi_major_axis,
                                render: (_, planet) => <MultiValue items={planet.properties} property='semi_major_axis' formatter={val => Numbers.format(val) + ' au'} />,
                                headerIcon: '/img/Database/Table/Orbit.svg'
                            },
                            {
                                title: 'Teplota',
                                accessor: (planet: any) => planet.surface_temperature,
                                render: (_, planet) => <MultiValue items={planet.properties} property='surface_temperature' formatter={val => Numbers.format(val) + ' °C'} />,
                                headerIcon: '/img/Database/Table/Temperature.svg'
                            },
                            {
                                title: 'Perioda',
                                accessor: (planet: any) => planet.orbital_period,
                                render: (_, planet) => <MultiValue items={planet.properties} property='orbital_period' formatter={val => Numbers.format(val) + ' d'} />,
                                headerIcon: '/img/Database/Table/Period.svg'
                            },
                            {
                                title: 'Rychlost',
                                accessor: (planet: any) => planet.properties[0].orbital_velocity,
                                render: (_, planet) => <MultiValue items={planet.properties} property='orbital_velocity' formatter={val => <>{Numbers.format(val)} <Fraction top='km' bottom='s' /></>} />,
                                headerIcon: '/img/Database/Table/Velocity.svg'
                            },
                            { title: 'Život', accessor: () => 'Vyloučen', headerIcon: '/img/Database/Table/Life.svg' },
                            {
                                title: strings.properties.distance,
                                accessor: planet => planet.properties[0].distance,
                                render: (_, planet) => <MultiValue items={planet.properties} property='distance' formatter={val => Numbers.format(val) + ' ly'} />,
                                headerIcon: '/img/Database/Table/Distance.svg'
                            },
                            {
                                title: <Colored color='#FAA'>Světelná křivka</Colored>,
                                accessor: () => '',
                                render: (_, __, i) => <MiniGraph data={i % 2 ? dd : dd2} />,
                                headerIcon: '/img/Database/Table/Discovery.svg',
                                width: '20rem'
                            },
                            {
                                title: strings.properties.datasets,
                                accessor: planet => planet.properties.length,
                                render: (_, planet) => (
                                    <>
                                        <MultiValue items={planet.properties} property='dataset' formatter={val => <IconText text={val} icon='/img/Database/Star/G.svg' />} />
                                    </>
                                ),
                                headerIcon: '/img/Database/Table/Datasets.svg',
                                width: 1.5
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
                    }
                ],
                getter: getPlanets,
                rowHeight: () => 96
            }
        case DbTable.DATASETS:
            return {
                levels: [
                    {
                        columns: [
                            { title: '#', accessor: (dataset, i) => i + 1, width: '3rem' },
                            {
                                title: strings.properties.type,
                                accessor: dataset => dataset.type,
                                render: type => <ItemImage image={`Database/Dataset/${pascalCase(type)}.svg`} />,
                                width: '4rem'
                            },
                            {
                                title: strings.properties.name,
                                accessor: dataset => dataset.name,
                                render: (name, dataset) => <Detail pathname='/abc'>
                                    <div><b>{name}</b><br /><i>{strings.datasets.types[dataset.type]}</i></div>
                                </Detail>,
                                width: 1.5,
                                interactive: true
                            },
                            {
                                title: strings.properties.objects,
                                accessor: dataset => Numbers.format(dataset.total_size),
                                headerIcon: '/img/Database/Table/Dataset/Objects.svg'
                            },
                            {
                                title: strings.properties.processed,
                                accessor: dataset => 100 - Math.floor(10000 * dataset.current_size / dataset.total_size) / 100,
                                render: (processed, dataset) => <ProgressBar range={dataset.total_size}
                                                                             value={dataset.total_size - dataset.current_size}
                                                                             label={prettyBytes(dataset.processed || 0)}
                                                                             title={`${Numbers.format(dataset.total_size - dataset.current_size)} / ${Numbers.format(dataset.total_size)}`} />,
                                headerIcon: '/img/Database/Table/Dataset/Processed.svg'
                            },
                            {
                                title: strings.properties.processTime,
                                accessor: dataset => dataset.time,
                                render: time => Dates.formatDistance(strings, 0, time, Dates.Format.LONG),
                                headerIcon: '/img/Database/Table/Dataset/Time.svg'
                            },
                            {
                                title: strings.properties.published,
                                accessor: dataset => dataset.created,
                                render: created => <DateTime s={created} />,
                                headerIcon: '/img/Database/Table/Dataset/Date.svg'
                            },
                            {
                                title: strings.properties.lastActivity,
                                accessor: dataset => dataset.modified,
                                render: modified => Dates.formatDistance(strings, modified),
                                headerIcon: '/img/Controls/Active.svg'
                            },
                            {
                                title: strings.properties.priority,
                                accessor: dataset => dataset.priority,
                                render: priority => <Priority label={strings.datasets.priorities[priority - 1]}
                                                              value={priority} />,
                                headerIcon: '/img/Database/Table/Dataset/Priority.svg'
                            },
                            {
                                title: strings.properties.url,
                                accessor: dataset => (dataset.items_getter || '') + (dataset.item_getter || ''),
                                render: (val, dataset) => <OptionalLine
                                    lines={[Url.parse(dataset.items_getter || '').hostname, Url.parse(dataset.item_getter || '').hostname]} />,
                                width: 2,
                                headerIcon: '/img/Database/Table/Dataset/Url.svg'
                            },
                            {
                                title: '',
                                accessor: () => '',
                                render: () => <ItemControls onEdit={() => null} onRemove={() => null} />,
                                width: 1.5
                            }
                        ]
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


const colors = ['#A50', '#FFF', '#A00', '#CC0']

const Image = Styled.div.attrs({ className: 'image--star' })`
    ${size('4rem')}
    ${image('Database/Star/Yellow.svg')}
    background-imagee: radial-gradient(${colors[3]}, #000);
    display: inline-block;
`

const PlanetImage = Styled(Image)`
    ${size('2.5rem')}
    ${image('Discovery/TargetPixel.svg')}
    background-imager: radial-gradient(#CA0, #000);
`

interface ItemImageProps {
    large?: boolean
    image: string
}

const ItemImage = Styled(Image)<ItemImageProps>`
    ${props => size(props.large ? '4rem' : '2.5rem')}
    ${props => image(props.image)}
    display: inline-block;
`