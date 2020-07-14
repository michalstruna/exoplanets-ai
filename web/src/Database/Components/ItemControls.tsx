import React from 'react'
import Styled from 'styled-components'
import { IconText } from '../../Layout'
import { Color, Duration } from '../../Style'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    onEdit?: () => void
    onRemove?: () => void
}

const Root = Styled.div`
    & > button {
        background-color: ${Color.DARKEST};
        display: inline-block;
        font-size: 80%;
        margin-left: 0.5rem;
        opacity: 1;
        padding: 0.5rem;
        transition: background-color ${Duration.MEDIUM};
        width: auto;
        
        &:first-of-type {
            margin-left: 0;
        }
        
        &:hover {
            background-color: ${Color.DARKEST_HOVER};
        }
    }
`

const ItemControls = ({ onEdit, onRemove, ...props }: Props) => {

    return (
        <Root {...props}>
            {onEdit && <IconText text='Upravit' icon='Controls/Edit.svg' size={IconText.SMALL} onClick={onEdit} />}
            {onRemove && <IconText text='Smazat' icon='Controls/Delete.svg' size={IconText.SMALL} onClick={onRemove} />}
        </Root>
    )

}

export default ItemControls