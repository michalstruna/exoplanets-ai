import React from 'react'
import Styled from 'styled-components'
import { FormContextValues, useForm } from 'react-hook-form'

import { Form } from '../../Form'
import { useActions, useStrings } from '../../Data'
import { DatasetNew } from '../types'
import { SubmitButton } from '../../Layout'
import { addDataset, updateDataset } from '../Redux/Slice'
import Tooltip from '../../Layout/Components/Tooltip'
import { Action } from '../../Data/Utils/Redux'

type Category<T> = [keyof T, string]
type Values = any

interface Props<T> extends React.ComponentPropsWithoutRef<'div'> {
    item: T
    categories: Category<T>[]
    onSubmit: (values: Values) => Action<any>
}

const Root = Styled.div`
    width: 35rem;
`


const DatasetsSelectionForm = <T extends any>({ item, categories, onSubmit, ...props }: Props<T>) => {

    const defaultValues = React.useMemo<Values>(() => {
        const result = {}

        for (const [group, field] of categories) {
            defaultValues[group] = {}

            for (const groupItem of item[group]) {
                defaultValues[group][groupItem[field]] = false
            }
        }

        return result
    }, [])

    const actions = useActions({ addDataset, updateDataset, hideTooltip: Tooltip.hide })
    const strings = useStrings().datasets.selection
    const form = useForm<Values>({ defaultValues })

    const handleSubmit = async (values: DatasetNew, form: FormContextValues<Values>) => {
        let action = await onSubmit(values)

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, 'Chyba')
        } else {
            form.reset(values)
            actions.hideTooltip()
        }
    }

    return (
        <Root {...props}>
            <Form onSubmit={handleSubmit} form={form}>

                <SubmitButton />
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