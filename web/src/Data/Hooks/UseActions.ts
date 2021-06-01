import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

const useActions = <T extends ActionCreatorsMapObject>(actions: T): T => {
    return bindActionCreators(actions, useDispatch())
}

export default useActions