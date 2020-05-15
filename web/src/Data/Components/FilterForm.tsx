import React from 'react'
import Styled from 'styled-components'

import { Arrays, Validator } from '../../Native'
import { Duration, image, opacityHover, size } from '../../Style'
import { useStrings } from '../index'
import { Field, Form } from '../../Form'
import { useFieldArray, useForm } from 'react-hook-form'

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

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    attributes: string[]
    onChange: (values: ObjectFilter) => void
    initialValues?: ObjectFilter
    defaultRelation?: Validator.Relation
    keys?: any//{ attribute: any, relation: any, value: any }
}

interface RowProps {
    isActive: boolean
}

const Root = Styled.div`
    font-size: 110%;
    margin: 1.5rem auto;
    width: 40rem;
    max-width: 100%;
`

const Delete = Styled.button.attrs({ type: 'button' })`
    ${image('Universe/Filter/Delete.svg', '70%')}
    ${opacityHover()}
    ${size('2rem !important')}
    min-width: 2rem;
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

type Values = {
    filter: any[]
}

const FilterForm = ({ defaultRelation, attributes, initialValues, onChange, keys, ...props }: Props) => {

    const strings = useStrings().filter

    const defaultValues = {
        filter: []
    }

    const form = useForm<Values>({ defaultValues })
    const fields = useFieldArray({ name: 'filter', control: form.control })

    const mapKeysIn = React.useCallback((filter: any): ObjectFilter => ({
        attribute: filter[keys.attribute] || [],
        relation: filter[keys.relation] || [],
        value: filter[keys.value] || []
    }), [keys.attribute, keys.relation, keys.value])

    const mapKeysOut = React.useCallback((filter: ObjectFilter): any => (
        { [keys.attribute]: filter.attribute, [keys.relation]: filter.relation, [keys.value]: filter.value }
    ), [keys.attribute, keys.relation, keys.value])

    const handleChange = React.useCallback((filter: ArrayFilter): void => {
        //if (onChange) {
        //    const values = mapKeysOut(getObjectFilter(getWithoutLast(filter)))
        //    onChange(values)
        //}
    }, [mapKeysOut, onChange])

    const getHandleFieldChange = (handleChange: any, i: any) => (
        (event: any) => {
            const values = form.getValues({ nest: true })
            handleChange(event)

            if (event.target.value) {
                console.log(i, values.filter.length - 1, values.filter)

                if (i === values.filter.length - 1) {
                    console.log(111, i)
                    fields.append({ attribute: attributes[0], relation: defaultRelation, value: '' })
                    //helpers.push({ attribute: attributes[0], relation: defaultRelation, value: '' })
                }
            } else {
                if (i === values.filter.length - 2) {
                    removeRow(values, i)
                }
            }
        }
    )

    const getArrayFilter = (values: ObjectFilter) => {
        const temp = { ...values } as any
        const result = [] as any

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
        console.log(values)

        const result = [...values]
        result.pop()
        return result
    }

    const fixFilter = React.useCallback((values: ObjectFilter): ObjectFilter => {
        const result = { attribute: [], relation: [], value: [] } as any

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
    }, [attributes])

    const initialFilter = React.useMemo(() => {
        const objectFilter = mapKeysIn(initialValues || {})
        const safeFilter = fixFilter(objectFilter)
        const arrayFilter = getArrayFilter(safeFilter)
        arrayFilter.push({ attribute: attributes[0], relation: defaultRelation, value: '' })
        handleChange(arrayFilter)
        return arrayFilter
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeRow = (values: Values, i: number) => {
        const last = Arrays.findLastIndex<any>(values.filter, (item, j) => item.value && i !== j)
        const toRemove = values.filter.length - last - 3

        fields.remove(i)

        for (let i = 0; i < toRemove; i++) {
            fields.remove(values.filter.length - 1)
        }
    }

    React.useEffect(() => {
        fields.append({ x: 'a' })
    }, [])

    const handleSubmit = (values: Values) => {
        console.log(values)
    }

    return (
        <Root>
            <Form onSubmit={handleSubmit} form={form}>
                {fields.fields.map((field, i) => (
                    <Row key={field.id} isActive={true}>
                        <Field
                            name={`filter[${i}].attribute`}
                            type={Field.Type.EMAIL}
                            label={strings.email}
                            required={strings.missingEmail}
                            invalid={strings.invalidEmail} />
                        <Field
                            name={`filter[${i}].relation`}
                            type={Field.Type.EMAIL}
                            label={strings.email}
                            required={strings.missingEmail}
                            invalid={strings.invalidEmail} />
                        <Field
                            name={`filter[${i}].value`}
                            type={Field.Type.EMAIL}
                            placeholder={strings.value}
                            onChange={getHandleFieldChange(handleChange, i)} />
                        <Delete onClick={() => removeRow(form.getValues({ nest: true }), i)} />
                    </Row>
                ))}
            </Form>
        </Root>
    )

    /*return (
        <Formik
            onSubmit={() => {}}
            initialValues={{ filter: initialFilter }}
            validate={values => handleChange(values.filter)}>
            {({ values, handleChange }) => (
                <Root {...props}>
                    <FieldArray name='filter'>
                        {helpers => (
                            <>
                                {values.filter && values.filter.map((value: any, i: any) => (
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
    )*/

}

FilterForm.defaultProps = {
    defaultRelation: Validator.Relation.CONTAINS,
    keys: { attribute: 'attribute', relation: 'relation', value: 'value' }
}

export default FilterForm