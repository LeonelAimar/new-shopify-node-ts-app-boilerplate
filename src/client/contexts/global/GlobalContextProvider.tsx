import { useReducer } from "react"
import { 
    BaseProviderComponent, GlobalActionTypes, GlobalMethods, 
    GlobalState 
} from "../../interfaces/AppInterfaces"
import { GlobalContext } from "./GlobalContext"
import { globalReducer } from "./globalReducer"

const INITIAL_STATE: GlobalState = {
    APP_NAME: 'TEST APP',
    clicks: 0
}

export const GlobalProvider = ({ children }: BaseProviderComponent) => {
    const [state, dispatch] = useReducer(globalReducer, INITIAL_STATE)

    const methods: GlobalMethods = {
        sumClick() {
            dispatch({ type: GlobalActionTypes.ADD_CLICK, payload: undefined })
        }
    }

    return (
        <GlobalContext.Provider value={{ state, methods }}>
            { children }
        </GlobalContext.Provider>
    )
}