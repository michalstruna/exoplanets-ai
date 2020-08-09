import React, { ChangeEvent } from 'react'
import Styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Color, Duration, size } from '../../Style'
import FieldType from '../Constants/FieldType'

interface Option {
    text: string
    value: string | number
}

interface Type {
    name: string
    validator: (value: any) => boolean
}

interface Props extends Omit<Omit<Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>, 'onChange'>, 'required'> {
    name: string
    type: Type
    placeholder?: string
    label?: string
    invalid?: string
    required?: string
    validator?: (value: any) => string
    options?: Option[]
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
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
    ${size('100%', '2.3rem')}
    box-sizing: border-box;
    display: block;
    padding: 0.5rem 0;
    outline: none;
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

const Field = ({ label, name, type, required, invalid, validator, placeholder, options, ...props }: Props) => {

    const [value, setValue] = React.useState<string>('')
    const { register, errors } = useFormContext()

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValue(event.target.value)
        props.onChange?.(event)
    }

    const validate = (value: any) => (
        (type.validator(value) && (!validator || validator(value))) || invalid || label || placeholder || 'Error'
    )

    const registerOptions = { required: { value: !!required, message: required! }, validate: { value: validate } }

    const renderComponent = (register: any) => {
        switch (type) {
            case FieldType.SELECT:
                return (
                    <select {...props as any} onChange={handleChange} ref={register(registerOptions)} name={name}>
                        {(options || []).map(({ text, value }, i) => (
                            <option key={value} value={value}>
                                {text}
                            </option>
                        ))}
                    </select>
                )
            default:
                return (
                    <Input
                        {...props}
                        name={name}
                        placeholder={placeholder}
                        type={type.name}
                        autoComplete='off'
                        ref={register(registerOptions)}
                        data-empty={value === '' || undefined}
                        onChange={handleChange} />
                )
        }
    }

    return (
        <Root>
            {renderComponent(register)}
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
    )

}

Field.Type = FieldType

export default Field