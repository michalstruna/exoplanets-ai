import React from 'react'
import Styled from 'styled-components'

import { EnumTextValue, FilterData, TextValue } from '../types'
import { useForm } from 'react-hook-form'
import { Field, Form } from '../../Form'
import { Duration, image, opacityHover, size } from '../../Style'
import { Validator } from '../../Native'
import { useStrings } from '..'
import { Relation } from '../../Native/Utils/Validator'

type Attribute = TextValue | EnumTextValue

interface Props extends Omit<Omit<React.ComponentPropsWithoutRef<'form'>, 'onChange'>, 'onSubmit'> {
    attributes: Attribute[]
    onChange?: (values: FilterData) => void
    onSubmit?: (values: FilterData) => void
    initialValues?: FilterData
}

type InternalFilterData<TValue = string | number> = {
    attribute: string
    relation: Validator.Relation
    value: TValue
}[]

type Values = { filter: InternalFilterData }

const toInternal = <T extends any>(filter: FilterData<T>): InternalFilterData<T> => filter.attribute.map((attr, i) => ({
    attribute: attr,
    relation: filter.relation[i],
    value: filter.value[i]
}))

const fromInternal = <T extends any>(filter: InternalFilterData<T>): FilterData<T> => ({
    attribute: filter.map(v => v.attribute),
    relation: filter.map(v => v.relation),
    value: filter.map(v => v.value)
})

const Root = Styled(Form)`
    
`

const Delete = Styled.button.attrs({ type: 'button' })`
    ${image('Database/Filter/Delete.svg', '60%')}
    ${opacityHover()}
    ${size('1.75rem !important')}
    min-width: 1.75rem;
`

const Row = Styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 -0.5rem;
    transition: opacity ${Duration.MEDIUM};
    
    & > * {
        margin: 0 0.5rem;
        width: calc(100% - 1rem);
    }
    
    &:hover {
        opacity: 1;
    }
    
    select {
        width: 100%;
    }
`

const Submit = Styled.button`
    ${image('Database/Filter/Submit.svg', '90%')}
    ${opacityHover()}
    ${size('1.75rem !important')}
    margin 0.3rem 0.5rem !important;
    min-width: 1.75rem;
`

const Filter = ({ attributes, onChange, initialValues, onSubmit, ...props }: Props) => {

    const strings = useStrings().filter

    const defaultValues = initialValues ? { filter: toInternal(initialValues) } : {
        filter: [{ attribute: attributes[0].value, relation: Validator.Relation.CONTAINS, value: '' }]
    }

    const form = useForm<Values>({ defaultValues })
    const [values, setValues] = React.useState<InternalFilterData>(defaultValues.filter)

    const handleChangeAttribute = (attribute: string, i: number) => {
        const attr = getAttrByName(attribute)
        let newValues = [...values]
        newValues[i].attribute = attribute
        newValues = setValue(newValues, 'values' in attr && attr.values ? attr.values[0].value : '', i)
        setValues(newValues)
    }

    const handleChangeRelation = (relation: Validator.Relation, i: number) => {
        const newValues = [...values]
        newValues[i].relation = relation
        setValues(newValues)
    }

    const setValue = (target: InternalFilterData, value: string | number, i: number) => {
        const isEmpty = !value
        target[i].value = value

        if (isEmpty && values.length === i + 2) {
            target = removeEmptyFromEnd(target)
        } else if (value && values.length === i + 1) {
            target.push({ attribute: attributes[0].value, relation: Relation.CONTAINS, value: '' })
        }

        return target
    }

    const handleChangeValue = (value: string | number, i: number) => {
        let newValues = setValue([...values], value, i)
        setValues(newValues)
    }

    React.useEffect(() => {
        onChange?.(fromInternal(values))
    }, [values])

    const removeEmptyFromEnd = (values: InternalFilterData): InternalFilterData => {
        for (let i = values.length - 1; i >= 0; i--) {
            if (values[i].value) {
                break
            } else {
                values.splice(i + 1, 1)
            }
        }

        return values
    }

    const removeRow = (i: number) => {
        const newValues = [...values]
        newValues.splice(i, 1)
        setValues(removeEmptyFromEnd(newValues))
    }

    const handleSubmit = () => {
        onSubmit?.(fromInternal(values))
    }

    const getAttrByName = (name: string): Attribute => (
        attributes.find(attr => attr.value === name)!
    )

    return (
        <Root {...props} onSubmit={handleSubmit} form={form}>
            {values.map((value, i) => {
                const attr = getAttrByName(value.attribute)
                const options = 'values' in attr ? attr.values : null

                return (
                    <Row key={i}>
                        <Field
                            name={`filter[${i}].attribute`}
                            type={Field.Type.SELECT}
                            options={attributes}
                            onChange={e => handleChangeAttribute(e.target.value, i)}
                            value={value.attribute} />
                        <Field
                            name={`filter[${i}].relation`}
                            type={Field.Type.SELECT}
                            options={Object.values(Validator.Relation).filter(item => typeof item === 'number').map(item => ({
                                value: item,
                                text: strings.relations[item]
                            }))}
                            onChange={e => handleChangeRelation(e.target.value as any, i)}
                            value={value.relation} />
                        {options ? (
                            <Field
                                name={`filter[${i}].value`}
                                type={Field.Type.SELECT}
                                onChange={e => handleChangeValue(e.target.value, i)}
                                value={value.value}
                                options={options} />
                        ) : (
                            <Field
                                name={`filter[${i}].value`}
                                type={Field.Type.TEXT}
                                placeholder={strings.value}
                                onChange={e => handleChangeValue(e.target.value, i)}
                                value={value.value} />
                        )}
                        {i === values.length - 1 ? <Submit /> : <Delete onClick={() => removeRow(i)} />}
                    </Row>
                )
            })}
        </Root>
    )

}

export default Filter