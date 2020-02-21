import React from 'react'
import Styled from 'styled-components'

import { Arrays, Duration, Mixin, Validator } from '../../Utils'
import { useStrings } from '../../Content'
import { Field, FieldArray, Formik } from 'formik'

type BrokenObjectFilter = any

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


const Filter: React.FC<Props> & Static = ({ defaultRelation, attributes, initialValues, onChange, keys, ...props }) => {

    const strings = useStrings().filter

    const handleChange = (filter: ArrayFilter): void => {
        if (onChange) {
            const values = mapKeysOut(getObjectFilter(getWithoutLast(filter)))
            onChange(values)
        }
    }

    const mapKeysIn = (filter: any): ObjectFilter => ({
        attribute: filter[keys.attribute] || [],
        relation: filter[keys.relation] || [],
        value: filter[keys.value] || []
    })

    const mapKeysOut = (filter: ObjectFilter): any => (
        { [keys.attribute]: filter.attribute, [keys.relation]: filter.relation, [keys.value]: filter.value }
    )

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

    const getWithoutLast = (values: ArrayFilter): ArrayFilter => {
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

    const fixFilter = (values: ObjectFilter): ObjectFilter => {
        const result = { attribute: [], relation: [], value: [] }

        if (values.attribute.length !== values.relation.length || values.relation.length !== values.value.length) {
            return result
        }

        for (const i in values.attribute) {
            if (Validator.is(values.attribute[i], attributes) && Validator.is(values.relation[i], Object.values(Validator.Relation))) {
                result.attribute.push(values.attribute[i])
                result.relation.push(values.relation[i])
                result.value.push(values.value[i])
            }
        }

        return result
    }

    const initialFilter = React.useMemo(() => {
        const objectFilter = mapKeysIn(forceArray(initialValues))
        const safeFilter = fixFilter(objectFilter)
        const arrayFilter = getArrayFilter(safeFilter)
        arrayFilter.push({ attribute: attributes[0], relation: defaultRelation, value: '' })
        handleChange(arrayFilter)
        return arrayFilter
    }, [])

    const remove = (values, helpers, i) => {
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
            initialValues={{ filter: initialFilter }}
            validate={values => handleChange(values.filter)}>
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
                                        <Delete onClick={() => remove(values, helpers, i)} />
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
    defaultRelation: Validator.Relation.CONTAINS,
    keys: { attribute: 'attribute', relation: 'relation', value: 'value' },
    onChange: () => null
}

export default Filter