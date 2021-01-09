import React, { ChangeEvent } from 'react'
import Styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Color, Duration, size } from '../../Style'
import FieldType from '../Constants/FieldType'
import { TextValue } from '../../Data'

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
    options?: TextValue<string | number | TextValue<string | number>[]>[]
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

type LabelProps = {
    error?: any
}

const Root = Styled.label`
    display: block;
    margin: 1rem 0;
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

const Select = Styled.select`
    ${size('100%', '2.3rem')}
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

const CheckSlider = Styled.div`
    background-color: ${Color.MEDIUM_DARK};
    border-radius: 1rem;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    user-select: none;
    top: 0;
    transition: ${Duration.SLOW};
    
    &:before {
        ${size('1.4rem')}
        background-color: white;
        border-radius: 50%;
        content: "";
        position: absolute;
        top: 50%;
        transition: transform ${Duration.SLOW};
        transform: translateY(-50%) translateX(0.4rem) translateZ(0);
    }
`

const CheckContainer = Styled.div`
    ${size('3.5rem', '1.8rem')}
    display: inline-block;
    user-select: none;
    position: relative;
    vertical-align: middle;

    input {
        opacity: 0;
        width: 0;
        height: 0;
        
        &:checked + ${CheckSlider} {
            background-color: #2196F3;
            
            &:before {
                transform: translateY(-50%) translateX(3.5rem) translateX(-0.3rem) translateX(-100%) translateZ(0);
            }
        }
    }
    
    & + ${Text} {
        cursor: pointer;
        display:inline-block;
        padding-left: 0.5rem;
        pointer-events: all;
        position: relative;
        user-select: none;
        vertical-align: middle;
        width: auto;
        max-width: calc(100% - 3.5rem);
        
        ${Label} {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
`

const Field = ({ label, name, type, required, invalid, validator, placeholder, options, ...props }: Props) => {

    const { register, errors, getValues } = useFormContext()
    const [value, setValue] = React.useState<string>(getValues(name) || '')

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
                    <Select {...props as any} onChange={handleChange} ref={register(registerOptions)} name={name}>
                        {Array.isArray(options![0].value) ? (
                            (options as TextValue<TextValue<string | number>[]>[]).map((group, i) => (
                                <optgroup label={group.text}>
                                    {group.value.map((option, i) => (
                                        <option key={i} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                </optgroup>
                            ))
                        ) : (
                            (options as TextValue<string | number>[]).map((option, i) => (
                                <option key={i} value={option.value}>
                                    {option.text}
                                </option>
                            ))
                        )}
                    </Select>
                )
            case FieldType.CHECKBOX:
                return (
                    <CheckContainer>
                        <input type='checkbox' onChange={handleChange} ref={register(registerOptions)} name={name} />
                        <CheckSlider />
                    </CheckContainer>

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
                        {errors[name].message || errors[name].type}
                    </Label>
                )}
                <Label>
                    {label}
                </Label>
            </Text>
        </Root>
    )

}

Field.Root = Root
Field.Type = FieldType

export default Field