import { Redux } from '../../Data'
import { TooltipData } from '../types'
import Tooltip from '../Components/Tooltip'

const Slice = Redux.slice(
    'layout',
    {
        tooltip: '',
    },
    ({ plain }) => ({
        setTooltip: plain<string>((state, action) => {
            state.tooltip = state.tooltip === action.payload ? '' : action.payload
        })
    })
)

export default Slice.reducer
export const { setTooltip } = Slice.actions