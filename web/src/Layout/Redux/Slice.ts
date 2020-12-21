import { Redux } from '../../Data'

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