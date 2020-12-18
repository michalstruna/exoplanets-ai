import React from 'react'
import Styled from 'styled-components'
import { IconText } from '../../Layout'
import { Color, Duration } from '../../Style'
import Tooltip from '../../Layout/Components/Tooltip'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    renderEditForm?: () => React.ReactNode
    onRemove?: () => void
}

const Root = Styled.div`
    & > * {
        display: inline-block;
        margin-left: 0.5rem;
        
        &:first-child {
            margin-left: 0;
        }
    }
`

const Button = Styled(IconText)`
    background-color: ${Color.DARKEST};
    display: inline-block;
    font-size: 80%;
    opacity: 1;
    padding: 0.5rem;
    transition: background-color ${Duration.MEDIUM};
    width: auto;
    
    &:hover {
        background-color: ${Color.DARKEST_HOVER};
    }
`

const ItemControls = ({ renderEditForm, onRemove, ...props }: Props) => {

    return (
        <Root {...props}>
            {renderEditForm && (
                <Tooltip render={renderEditForm}>
                    <Button text='Upravit' icon='Controls/Edit.svg' size={IconText.SMALL} onClick={() => null} />
                </Tooltip>
            )}
            {onRemove && <Button text='Smazat' icon='Controls/Delete.svg' size={IconText.SMALL} onClick={onRemove} />}
        </Root>
    )

}

export default ItemControls