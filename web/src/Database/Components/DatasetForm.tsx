import React from 'react'
import Styled from 'styled-components'
import { UseFormMethods, useForm } from 'react-hook-form'
import { camelCase } from 'change-case'

import { Field, Form, FormGroup } from '../../Form'
import { useActions, useStrings } from '../../Data'
import { Dataset, DatasetNew } from '../types'
import { ControlTitle, SubmitButton } from '../../Layout'
import DatasetPriority from '../Constants/DatasetPriority'
import DatasetType from '../Constants/DatasetType'
import DatasetFields from '../Constants/DatasetFields'
import { addDataset, updateDataset } from '../Redux/Slice'
import Tooltip from '../../Layout/Components/Tooltip'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    dataset?: Dataset
}

const Root = Styled.div`
    width: 35rem;
`

const datasetTypeToEntity: Record<DatasetType, string> = {
    [DatasetType.STAR_PROPERTIES]: 'stars',
    [DatasetType.TARGET_PIXEL]: 'tp',
    [DatasetType.LIGHT_CURVE]: 'lc',
    [DatasetType.PLANET_PROPERTIES]: 'planets',
    [DatasetType.RADIAL_VELOCITY]: 'rv'
}

const defaultValues: DatasetNew = { fields: {}, item_getter: '', items_getter: '', name: '', type: DatasetType.STAR_PROPERTIES }

const DatasetForm = ({ dataset, ...props }: Props) => {

    const actions = useActions({ addDataset, updateDataset, hideTooltip: Tooltip.hide })
    const globalStrings = useStrings()
    const strings = globalStrings.datasets
    const form = useForm<DatasetNew>({ defaultValues: dataset ?? defaultValues })
    const values = form.watch()

    const handleSubmit = async (values: DatasetNew, form: UseFormMethods<DatasetNew>) => {
        const { type, ...updateValues } = values
        let action = await (dataset ? actions.updateDataset([dataset._id, updateValues]) : actions.addDataset(values))

        if (action.error) {
            form.setError(Form.GLOBAL_ERROR, { type: action.error })
        } else {
            form.reset(dataset ? values : undefined)
            actions.hideTooltip()
        }
    }

    const datasetType = values.type as DatasetType

    return (
        <Root {...props}>
            <Form onSubmit={handleSubmit} form={form}>
                <ControlTitle>
                    {dataset ? strings.edit : strings.new}
                </ControlTitle>
                <FormGroup title={strings.dataFields}>
                    <Field
                        name='name'
                        type={Field.Type.TEXT}
                        label={strings.name}
                        required={strings.missingName} />
                    <Field
                        name='type'
                        type={Field.Type.SELECT}
                        label={strings.type}
                        required={strings.missingType}
                        options={Object.entries(strings.types).map(([value, text]) => ({ text, value } as any))}
                        readOnly={!!dataset} />
                    <Field
                        name='priority'
                        type={Field.Type.SELECT}
                        label={strings.priority}
                        required={strings.missingPriority}
                        defaultValue={DatasetPriority.NORMAL}
                        options={Object.entries(strings.priorities).map(([value, text]) => ({ text, value } as any))} />
                    <Field
                        name='items_getter'
                        type={Field.Type.TEXT}
                        label={strings.itemsGetter} />
                    <Field
                        name='item_getter'
                        type={Field.Type.TEXT}
                        label={strings.itemGetter} />
                        <div />
                </FormGroup>
                <FormGroup title={strings.fields}>
                    {Object.values(DatasetFields[datasetType]).map((field: any, i) => (
                        <Field
                            key={i}
                            name={`fields.${field}`}
                            type={Field.Type.TEXT}
                            label={globalStrings[datasetTypeToEntity[datasetType]][camelCase(field)]} />
                    ))}
                </FormGroup>
                <SubmitButton />
            </Form>
        </Root>
    )

}

export default DatasetForm