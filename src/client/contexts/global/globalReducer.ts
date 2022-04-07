import { GlobalAction, GlobalActionTypes, GlobalState } from "../../interfaces/AppInterfaces";

export const globalReducer = ( state: GlobalState, action: GlobalAction ): GlobalState => {
    
    switch ( action.type ) {
        case GlobalActionTypes.ADD_CLICK:
            return {
                ...state,
                clicks: state.clicks + 1
            }
        case GlobalActionTypes.CHANGE_APP_NAME:
            return {
                ...state,
                APP_NAME: action.payload
            }
        default:
            return state
    }
}