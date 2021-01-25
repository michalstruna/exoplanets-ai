import React from 'react'
import Styled from 'styled-components'
import { Color, Duration, size } from '../../Style'


interface Props extends React.ComponentPropsWithoutRef<'input'> {

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

const Preview = Styled.img`
    max-width: 100%;
    max-height: 100%;
`

const ImageUpload = ({ ...props }: Props) => {

    const [preview, setPreview] = React.useState<string>()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        setPreview(file ? URL.createObjectURL(file) : undefined)
        props.onChange?.(event)
    }

    return (
        <Root onClick={e => e.stopPropagation()}>
            <Input {...props} type='file' onChange={handleChange} />
            {preview && <Preview src={preview} />}
        </Root>
    )

}

export default ImageUpload