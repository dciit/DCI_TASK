import { combineReducers } from 'redux'
import reducer from './initReducer'
const rootReducer = combineReducers({
  redux: reducer
})

export default rootReducer