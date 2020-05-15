import React from 'react'
import Styled from 'styled-components'
import { useForm, FormContextValues, FormContext } from 'react-hook-form'

import { Color, Duration } from '../../Style'
import { Loader } from '../../Async'

interface Props<Values> extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
    defaultValues?: Values
    onSubmit: (values: Values, form: FormContextValues<Values>) => void
    form?: FormContextValues<Values>
}

const Root = Styled.form`
    button:not([type]) {
        background-color: ${Color.DARKEST};
        color: ${Color.LIGHT};
        display: block;
        font-weight: bold;
        margin: 1rem auto;
        margin-top: 2rem;
        padding: 0.8rem 0;
        position: relative;
        transition: background-color ${Duration.FAST}, color ${Duration.FAST};
        width: 100%;
        
        &:hover {
            background-color: ${Color.DARKEST_HOVER};
        }
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
    margin: 0 auto;
    margin-bottom: 0.5rem;
    text-align: center;
`

const Form = <Values extends any>({ defaultValues, onSubmit, children, form: outerForm, ...props }: Props<Values>) => {

    const localForm = useForm<Values>({ defaultValues })
    const form = outerForm || localForm

    return (
        <Root
            {...props}
            noValidate={true}
            data-invalid={!(form.formState.isValid || !form.formState.isSubmitted) || undefined}
            onSubmit={form.handleSubmit(values => onSubmit(values, form))}>
            <FormContext {...form}>
                {children}
            </FormContext>
            {(form.errors as any)[Form.GLOBAL_ERROR] && <ErrorContainer>{(form.errors as any)[Form.GLOBAL_ERROR].type}</ErrorContainer>}
            {form.formState.isSubmitting && <FormLoader />}
        </Root>
    )

}

Form.GLOBAL_ERROR = '__global__' as any

export default Form