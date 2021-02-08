import React from 'react'
import Styled from 'styled-components'
import { IconText } from '../../Layout'
import { Color, Duration } from '../../Style'
import Tooltip from '../../Layout/Components/Tooltip'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    renderEdit?: () => React.ReactNode
    renderRemove?: () => React.ReactNode
    renderReset?: () => React.ReactNode
    onEdit?: () => void
    onRemove?: () => void
    onReset?: () => void
}

const Root = Styled.div`
    & > * {
        display: inline-block;
        margin-left: 0.5rem;
        width: auto;
        
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

const ItemControls = ({ renderEdit, renderRemove, renderReset, onEdit, onRemove, onReset, ...props }: Props) => {

    return (
        <Root {...props}>
            {renderEdit ? (
                <Tooltip render={renderEdit}>
                    <Button text='Upravit' icon='Controls/Edit.svg' size={IconText.SMALL} onClick={() => null} />
                </Tooltip>
            ) : (onEdit && <Button text='Upravit' icon='Controls/Edit.svg' size={IconText.SMALL} onClick={onEdit} />)}

            {renderRemove ? (
                <Tooltip render={renderRemove}>
                    <Button text='Smazat' icon='Controls/Delete.svg' size={IconText.SMALL} onClick={() => null} />
                </Tooltip>
            ) : (onRemove && <Button text='Smazat' icon='Controls/Delete.svg' size={IconText.SMALL} onClick={onRemove} />)}

            {renderReset ? (
                <Tooltip render={renderReset}>
                    <Button text='Reset' icon='Controls/Reset.svg' size={IconText.SMALL} onClick={onReset} />
                </Tooltip>
            ) : (onReset && <Button text='Reset' icon='Controls/Reset.svg' size={IconText.SMALL} onClick={onReset} />)}
        </Root>
    )

}

export default ItemControls