import React from 'react'
import Styled from 'styled-components'

import { Arrays, Duration, Mixin, Validator } from '../../Utils'
import { useStrings } from '../../Content'
import { Field, FieldArray, Formik } from 'formik'

type BrokenObjectFilter = {
    attribute: string | string[]
    relation: string | string[] | number | number[]
    value: any | any[]
}

type ObjectFilter = {
    attribute: string[]
    relation: Validator.Relation[]
    value: any[]
}

type ArrayFilter = {
    attribute: string
    relation: Validator.Relation
    value: any
}[]

interface Static {

}

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    attributes: string[]
    onChange: (values: ObjectFilter) => void
    initialValues?: BrokenObjectFilter
    defaultRelation?: Validator.Relation
    keys?: { attribute: any, relation: any, value: any }
}

interface RowProps {
    isActive: boolean
}

const Root = Styled.div`
    font-size: 110%;
    margin: 1rem auto;
    width: 40rem;
    max-width: 100%;
`

const Delete = Styled.button`
    ${Mixin.Image('Universe/Filter/Delete.svg', '70%')}
    ${Mixin.OpacityHover()}
    ${Mixin.Size('3rem !important')}
`

const Row = Styled.div<RowProps>`
    display: flex;
    justify-content: space-between;
    margin: 0 -0.5rem;
    transition: opacity ${Duration.MEDIUM};
    
    & > * {
        margin: 0 0.5rem;
        width: calc(100% - 1rem);
    }
    
    ${({ isActive }) => !isActive && `
        opacity: 0.5;
    `}
    
    &:hover {
        opacity: 1;
    }
    
    &:last-of-type {
        ${Delete} {
            visibility: hidden;
        }
    }
`


const Filter: React.FC<Props> & Static = ({ defaultRelation, attributes, initialValues: _initialValues, onChange, keys, ...props }) => {

    const strings = useStrings().filter

    const getHandleFieldChange = (values, handleChange, helpers, i) => (
        event => {
            handleChange(event)

            if (event.target.value) {
                if (i === values.filter.length - 1) {
                    helpers.push({ attribute: attributes[0], relation: defaultRelation, value: '' })
                }
            } else {
                if (i === values.filter.length - 2) {
                    remove(values, helpers, i)
                }
            }
        }
    )

    const getArrayFilter = (values: ObjectFilter) => {
        const temp = { ...values }
        const result = []

        for (const i in temp.attribute) {
            result[i] = {}

            for (const j in temp) {
                result[i][j] = temp[j][i]
            }
        }

        return result
    }

    const getObjectFilter = (values: ArrayFilter) => {
        return {
            attribute: values.map(item => item.attribute),
            relation: values.map(item => item.relation),
            value: values.map(item => item.value)
        }
    }

    const getWithoutLast = values => {
        const result = [...values]
        result.pop()
        return result
    }

    const forceArray = (values: BrokenObjectFilter): ObjectFilter => {
        const result = { ...values }

        for (const i in result) {
            result[i] = Arrays.forceArray(result[i], true)
        }

        return result as ObjectFilter
    }

    const initialValues = React.useMemo(() => {
        const objectFilter = forceArray(_initialValues)
        const arrayFilter = getArrayFilter(objectFilter)
        arrayFilter.push({ attribute: attributes[0], relation: defaultRelation, value: '' })
        return arrayFilter
    }, [])

    const remove = (values, helpers, i, withUpdate = false) => {
        const last = Arrays.findLastIndex<any>(values.filter, (item, j) => item.value && i !== j)
        const toRemove = values.filter.length - last - 3

        helpers.remove(i)

        for (let i = 0; i < toRemove; i++) {
            helpers.pop()
        }
    }

    return (
        <Formik
            onSubmit={() => null}
            initialValues={{ filter: initialValues }}
            validate={onChange ? (values => onChange(getObjectFilter(getWithoutLast(values.filter)))) : undefined}>
            {({ values, handleChange }) => (
                <Root {...props}>
                    <FieldArray name='filter'>
                        {helpers => (
                            <>
                                {values.filter && values.filter.map((value, i) => (
                                    <Row key={i} isActive={!!value.value}>
                                        <Field as='select' name={`filter.${i}.attribute`}>
                                            {attributes.map((attribute, i) => (
                                                <option value={attribute} key={i}>{attribute}</option>
                                            ))}
                                        </Field>
                                        <Field as='select' name={`filter.${i}.relation`}>
                                            {Object.values(Validator.Relation).filter(item => typeof item === 'number').map((relation, i) => (
                                                <option value={relation} key={i}>{strings.relations[relation]}</option>
                                            ))}
                                        </Field>
                                        <Field
                                            autoComplete='off'
                                            name={`filter.${i}.value`}
                                            placeholder={strings.value}
                                            onChange={getHandleFieldChange(values, handleChange, helpers, i)} />
                                        <Delete onClick={() => remove(values, helpers, i, true)} />
                                    </Row>
                                ))}
                            </>
                        )}
                    </FieldArray>
                </Root>
            )}
        </Formik>
    )

}

Filter.defaultProps = {
    initialValues: { attribute: [], relation: [], value: [] },
    defaultRelation: Validator.Relation.CONTAINS,
    keys: { attribute: 'attribute', relation: 'relation', value: 'value' }
}

export default Filter