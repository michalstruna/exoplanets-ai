import React from 'react'
import Styled from 'styled-components'
import { useForm, FormContextValues, FormContext } from 'react-hook-form'

import { Color, opacityHover } from '../../Style'
import { Loader } from '../../Async'
import { SecondaryButton } from '../../Layout'

interface Props<Values> extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
    defaultValues?: Values
    onSubmit: (values: Values, form: FormContextValues<Values>) => void
    form?: FormContextValues<Values>
    buttons?: [(() => void) | undefined, string][]
}

const Root = Styled.form`
    overflow: hidden;

    button:not([type]) {
        display: block;
        font-weight: bold;
        margin: 0 auto;
        margin-top: 2rem;
        position: relative;
        width: 100%;
    }    
    
    &[data-invalid] {
        button:not([type]) {
            opacity: 0.5;
            pointer-events: none;
        }
    }
`

const FormLoader = Styled(Loader)`
    background-color: rgba(255, 255, 255, 0.1);
`

const ErrorContainer = Styled.p`
    color: ${Color.RED};
    font-size: 90%;
    margin: 0.5rem auto;
    text-align: center;
`

interface ButtonsProps {
    single: boolean
}

const Buttons = Styled.div<ButtonsProps>`
    display: flex;
    justify-content: ${props => props.single ? 'center' : 'space-between'};
    margin-top: 1rem;
`

const Form = <Values extends any = any>({ defaultValues, onSubmit, children, form: outerForm, buttons, ...props }: Props<Values>) => {

    const localForm = useForm<Values>({ defaultValues })
    const form = outerForm || localForm

    return (
        <Root
            {...props}
            noValidate={true}
            data-invalid={/*!(form.formState.isValid || !form.formState.isSubmitted) || */undefined}
            onSubmit={form.handleSubmit(values => onSubmit(values, form))}>
            <FormContext {...form}>
                {children}
            </FormContext>
            {(form.errors as any)[Form.GLOBAL_ERROR] && <ErrorContainer>{(form.errors as any)[Form.GLOBAL_ERROR].type}</ErrorContainer>}
            {form.formState.isSubmitting && <FormLoader />}
            {buttons && (
                <Buttons single={buttons.length === 1}>
                    {buttons.map(([handler, text], i) => handler && text && (
                        <SecondaryButton onClick={handler} key={i} type='button'>
                            {text}
                        </SecondaryButton>
                    ))}
                </Buttons>
            )}
        </Root>
    )

}

Form.GLOBAL_ERROR = '__global__' as any

export default Form