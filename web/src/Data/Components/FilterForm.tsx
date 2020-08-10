import React from 'react'
import Styled from 'styled-components'

import { Arrays, Validator } from '../../Native'
import { Duration, image, opacityHover, size } from '../../Style'
import { useStrings } from '../index'
import { Field, Form } from '../../Form'
import { useFieldArray, useForm } from 'react-hook-form'

type Filter = {
    attribute: string[]
    relation: Validator.Relation[]
    value: any[]
}

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    attributes: [string, string][]
    onChange: (values: Filter) => void
    initialValues?: Filter
    defaultRelation?: Validator.Relation
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
    ${image('Database/Filter/Delete.svg', '60%')}
    ${opacityHover()}
    ${size('1.75rem !important')}
    min-width: 1.75rem;
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
    
    select {
        width: 100%;
    }
`

type Values = {
    filter: { attribute: string, relation: Validator.Relation, value: any }[]
}

const FilterForm = ({ defaultRelation, attributes, initialValues, onChange, ...props }: Props) => {

    const strings = useStrings().filter
    const form = useForm<Values>({ defaultValues: { filter: [{ attribute: attributes[0] && attributes[0][0], relation: defaultRelation, value: '' }] } })
    const fields = useFieldArray({ name: 'filter', control: form.control })

    const getHandleFieldChange = (i: any) => (
        (event: any) => {
            const values = form.getValues({ nest: true })

            if (event.target.value) {
                if (i === values.filter.length - 1) {
                    fields.append({ attribute: attributes[0], relation: defaultRelation, value: '' })
                }
            } else {
                if (i === values.filter.length - 2) {
                    removeRow(values, i)
                }
            }
        }
    )

    const removeRow = (values: Values, i: number) => {
        const last = Arrays.findLastIndex<any>(values.filter, (item, j) => item.value || (!values.filter[i].value && j === i))

        if (last === i) {
            const anotherLast = Arrays.findLastIndex<any>(values.filter, (item, j) => item.value && i !== j)
            fields.remove(Arrays.range(anotherLast + 1, values.filter.length - 2))
        } else {
            fields.remove(i)
        }
    }

    return (
        <Root>
            <Form onSubmit={() => null} form={form}>
                {fields.fields.map((field, i) => (
                    <Row key={field.id} isActive={true}>
                        <Field
                            name={`filter[${i}].attribute`}
                            type={Field.Type.SELECT}
                            options={attributes.map(attr => ({ text: attr[1], value: attr[0] }))} />
                        <Field
                            name={`filter[${i}].relation`}
                            type={Field.Type.SELECT}
                            options={Object.values(Validator.Relation).filter(item => typeof item === 'number').map(item => ({ value: item, text: strings.relations[item] }))}/>
                        <Field
                            name={`filter[${i}].value`}
                            type={Field.Type.EMAIL}
                            placeholder={strings.value}
                            onChange={getHandleFieldChange(i)} />
                        <Delete onClick={() => removeRow(form.getValues({ nest: true }), i)} />
                    </Row>
                ))}
            </Form>
        </Root>
    )
}

FilterForm.defaultProps = {
    defaultRelation: Validator.Relation.CONTAINS
}

export default FilterForm