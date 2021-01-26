import React from 'react'
import Styled from 'styled-components'

import { Color, Duration, image, opacityHover, size } from '../../Style'
import { Avatar } from '../../User'


interface Props extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> {
    defaultValue?: string
    onChange?: (value: File | null) => void
}

interface RootProps {
    active?: boolean
}

const Root = Styled.label<RootProps>`
    ${size('7.4rem')}
    align-items: center;
    border: 2px dashed ${props => props.active ? Color.BLUE : Color.MEDIUM};
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    outline: none !important;
    position: relative;
    transition: border-color ${Duration.MEDIUM};
`

const Input = Styled.input`
    position: absolute;
    visibility: hidden;
`

const DeleteButton = Styled.button`
    ${image('Controls/Delete.svg', 'auto 70%')}
    ${size('1.5rem')}
    ${opacityHover()}
    background-color: ${Color.SEMITRANSPARENT_DARKEST};
    position: absolute;
    right: 0rem;
    top: 0rem;
`

const ImageUpload = ({ defaultValue, ...props }: Props) => {

    const [preview, setPreview] = React.useState<string | undefined>(defaultValue)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        event.preventDefault()
        const file = (event.target as HTMLInputElement).files?.[0] || null
        setPreview(file ? URL.createObjectURL(file) : undefined)
        props.onChange?.(file)
    }

    return (
        <Root onClick={e => e.stopPropagation()}>
            <Input {...props} type='file' onChange={handleChange} />
            {preview && <Avatar src={preview} size='100%' />}
            {preview && <DeleteButton type='button' onClick={handleChange} />}
        </Root>
    )

}

export default ImageUpload