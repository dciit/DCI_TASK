import { createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import rootReducer from './rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import { base } from '../constants'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: `${base}-root`,
    storage,
}
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const persistedReducer = persistReducer<any, any>(persistConfig, rootReducer);
const middleware: any = [thunk]
const composeEnhancers = typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore<any, any>(persistedReducer, composeEnhancers(applyMiddleware(...middleware)))
let persistor = persistStore(store);
export { store, persistor }
