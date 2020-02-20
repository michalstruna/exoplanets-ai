import React from 'react'
import Styled from 'styled-components'

import { Arrays, Duration, Mixin } from '../../Utils'
import { useStrings } from '../../Content'
import { Field, FieldArray, Formik } from 'formik'

interface Static {

}

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    handleChange?: (values: any) => void
    initialValues?: any
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

const attributes = ['starName', 'starMass']
const relations = ['contains', 'equals', 'is_greater_than', 'is_less_then']


const Filter: React.FC<Props> & Static = ({ initialValues, handleChange, ...props }) => {

    const strings = useStrings().database.filter

    const getHandleFieldChange = (values, handleChange, helpers, i) => (
        event => {
            handleChange(event)

            if (event.target.value) {
                if (i === values.filter.length - 1) {
                    helpers.push({ attribute: '', relation: '', value: '' })
                }
            } else {
                if (i === values.filter.length - 2) {
                    const last = Arrays.findLastIndex<any>(values.filter, (item, j) => item.value && i !== j)
                    const toRemove = values.filter.length - last - 2

                    for (i = 0; i < toRemove; i++) {
                        helpers.pop()
                    }
                }
            }
        }
    )

    const getWithoutLast = values => {
        const result = [...values]
        result.pop()
        return result
    }

    const initValues = React.useMemo(() => {
        const result = [...initialValues]
        result.push({ attribute: 'starMass', relation: 'equals', value: '' })
        return result
    }, [])

    return (
        <Formik
            onSubmit={() => null}
            initialValues={{ filter: initValues }}
            validate={handleChange ? (values => handleChange(getWithoutLast(values.filter))) : undefined}>
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
                                            {relations.map((operation, i) => (
                                                <option value={operation} key={i}>{operation}</option>
                                            ))}
                                        </Field>
                                        <Field
                                            autoComplete='off'
                                            name={`filter.${i}.value`}
                                            placeholder={strings.value}
                                            onChange={getHandleFieldChange(values, handleChange, helpers, i)} />
                                        <Delete onClick={() => helpers.remove(i)} />
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
    initialValues: []
}

export default Filter