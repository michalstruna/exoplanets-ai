import { Redux } from '../../Data'
import { TooltipData } from '../types'
import Tooltip from '../Components/Tooltip'

const Slice = Redux.slice(
    'layout',
    {
        tooltip: 0,
    },
    ({ plain }) => ({
        setTooltip: plain<number>((state, action) => {
            state.tooltip = state.tooltip === action.payload ? 0 : action.payload
        })
    })
)

export default Slice.reducer
export const { setTooltip } = Slice.actions