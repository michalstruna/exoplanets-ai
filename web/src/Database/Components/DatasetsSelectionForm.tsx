import React from 'react'
import Styled from 'styled-components'
import { UseFormReturn, useForm } from 'react-hook-form'

import { Field, FieldType, Form, FormGroup, ResetFormButton } from '../../Form'
import { useActions, useStrings } from '../../Data'
import { ControlTitle, MiniPrimaryButton } from '../../Layout'
import { addDataset, updateDataset } from '../Redux/Slice'
import Tooltip from '../../Layout/Components/Tooltip'
import { Action } from '../../Data/Utils/Redux'
import { Color } from '../../Style'
import { DatasetSelection } from '../types'

type Category<Key, GroupKey> = [Key, GroupKey, string?]
type Values = Record<string, Record<string, boolean>>

interface Props<Item, Key, GroupKey> extends Omit<Omit<React.ComponentPropsWithoutRef<'div'>, 'onSubmit'>, 'title'> {
    item: Item
    categories: Category<Key, GroupKey>[]
    onSubmit: (values: DatasetSelection<Item>) => Action<any>
    title?: React.ReactNode
    submitLabel?: string
}

const Root = Styled.div`
    width: 20rem;
`

const Message = Styled.p`
    color: ${Color.LIGHT_RED};
    font-size: 80%;
    white-space: nowrap; 
`

const getFormValuesToOutput = <T extends any>(values: Values): DatasetSelection<T> => {
    const result: DatasetSelection<T> = {}

    for (const groupName in values) {
        result[groupName] = []

        for (const i in values[groupName]) {
            if (values[groupName][i]) {
                result[groupName].push(i)
            }
        }
    }

    return result
}

const DatasetsSelectionForm = <Item extends Record<Key, Record<GroupKey, GroupItem>[]>, Key extends keyof Item, GroupKey extends keyof Item[Key][number], GroupItem extends any>({ item, categories, onSubmit, title, submitLabel, ...props }: Props<Item, Key, GroupKey>) => {

    const defaultValues: Values = React.useMemo<Values>(() => {
        const result = {} as any
        
        for (const [group, field] of categories) {
            result[group] = {}

            for (const groupItem of item[group]) {
                result[group][groupItem[field]] = false
            }
        }

        return result
    }, [item, categories])

    const form = useForm({ defaultValues })
    const values = form.watch()

    const nSelected = Object.values(values).reduce((prev, curr) => prev + Object.values(curr).filter(c => !!c).length, 0)

    const strings = useStrings().datasets.selection
    const actions = useActions({ addDataset, updateDataset, hideTooltip: Tooltip.hide })

    const handleSubmit = async (values: Values, form: UseFormReturn<Values>) => {
        let action = await onSubmit(getFormValuesToOutput(values))

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, { type: action.payload.message })
        } else {
            form.reset()
            actions.hideTooltip()
        }
    }

    return (
        <Root {...props}>
            <Form onSubmit={handleSubmit} form={form}>
                {title && <ControlTitle>
                    {title}
                </ControlTitle>}
                {categories.map(([group, field, title], i) => (
                    <FormGroup key={i} nColumns={1} title={title}>
                        {item[group].length > 0 ? item[group].map((groupItem: any, i: number ) => (
                            <Field name={`${group}.${groupItem[field]}`} type={FieldType.CHECKBOX} label={groupItem[field]} />
                        )) : <Message>{strings.noDatasets}</Message>}
                    </FormGroup>
                ))}
                <FormGroup nColumns={2}>
                    <ResetFormButton />
                    <MiniPrimaryButton disabled={nSelected === 0}>
                        {submitLabel} ({nSelected})
                    </MiniPrimaryButton>
                </FormGroup>
            </Form>
        </Root>
    )

}

DatasetsSelectionForm.Type = {
    STAR: [
        ['properties', 'dataset'],
        ['light_curves', 'dataset']
    ]
}

export default DatasetsSelectionForm