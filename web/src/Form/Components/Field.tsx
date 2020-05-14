import React, { ChangeEvent } from 'react'
import Styled from 'styled-components'

import { Color, Duration, size } from '../../Style'
import FieldType from '../Constants/FieldType'
import FormContext from './FormContext'

interface Static {
    Type: typeof FieldType
}

interface Type {
    name: string
    validator: (value: any) => boolean
}

interface Props extends Omit<Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>, 'required'> {
    name: string
    type: Type
    placeholder?: string
    label?: string
    invalid?: string
    required?: string
    validator?: (value: any) => string
}

type LabelProps = {
    error?: any
}

const Root = Styled.label`
    display: block;
    margin: 0.5rem 0;
    margin-top: 1rem;
    position: relative;
    text-align: left;
`

const Input = Styled.input`
    box-sizing: border-box;
    display: block;
    padding: 0.5rem 0;
    outline: none;
    width: 100%;
`

const Text = Styled.section`
    ${size('100%', '2rem', true)}
    box-sizing: border-box;
    display: block;
    font-size: 90%;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    top: 0;
    transition: transform ${Duration.MEDIUM}, color ${Duration.MEDIUM};
    transform-origin: left center;
    
    input:focus + &, input:not([data-empty="true"]) + &, select + &, textarea:focus + &, textarea:not([data-empty="true"]) + & {
        transform: translateY(-1.1rem) scale(0.8) translateZ(0);
    }
`

const Label = Styled.p<LabelProps>`
    color: ${props => props.error ? Color.RED : Color.LIGHTEST};
    margin: 0;
`

const Field: React.FC<Props> & Static = ({ label, name, type, required, invalid, validator, placeholder, ...props }) => {

    const [value, setValue] = React.useState<string>('')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const validate = (value: any) => (
        (type.validator(value) && (!validator || validator(value))) || invalid || label || placeholder || 'Error'
    )

    return (
        <FormContext.Consumer>
            {({ errors, register }) => (
                <Root>
                    <Input
                        {...props}
                        name={name}
                        placeholder={placeholder}
                        type={type.name}
                        autoComplete='off'
                        ref={register({
                            required: { value: !!required, message: required! },
                            validate: { value: validate }
                        })}
                        data-empty={value === '' || undefined}
                        onChange={handleChange} />
                    <Text>
                        {errors[name] && (
                            <Label error={true}>
                                {errors[name].message}
                            </Label>
                        )}
                        <Label>
                            {label}
                        </Label>
                    </Text>
                </Root>
            )}
        </FormContext.Consumer>
    )

}

Field.Type = FieldType

export default Field