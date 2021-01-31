import React from 'react'
import Styled from 'styled-components'
import { useForm, UseFormMethods, FormProvider, FieldValues, DefaultValues } from 'react-hook-form'

import { Color } from '../../Style'
import { Loader } from '../../Async'
import { SecondaryButton } from '../../Layout'

interface Props<Values extends FieldValues> extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
    defaultValues?: DefaultValues<Values>
    onSubmit: (values: Values, form: UseFormMethods<Values>) => void
    form?: UseFormMethods<Values>
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

const Form = <Values extends FieldValues>({ defaultValues, onSubmit, children, form: outerForm, buttons, ...props }: Props<Values>) => {

    const localForm = useForm<Values>({ defaultValues })
    const form = outerForm || localForm

    return (
        <FormProvider {...form}>
            <Root
                {...props}
                noValidate={true}
                onSubmit={form.handleSubmit(values => onSubmit(values, form))}>
                {children}
                {form.errors[Form.GLOBAL_ERROR] && <ErrorContainer>{(form.errors as any)[Form.GLOBAL_ERROR].type}</ErrorContainer>}
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
        </FormProvider>

    )

}

Form.Root = Root
Form.GLOBAL_ERROR = '__global__' as any

export default Form