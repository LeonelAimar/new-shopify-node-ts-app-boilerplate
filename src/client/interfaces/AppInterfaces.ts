export interface CustomStyleSheet {
    [key: string]: React.CSSProperties;
}

export interface BaseProviderComponent {
    children:       JSX.Element | JSX.Element[];
}

export interface GlobalState {
    APP_NAME:       string;
    clicks:         number;
}

export interface GlobalAction {
    type:           GlobalActionTypes;
    payload:        any;
}

export enum GlobalActionTypes {
    CHANGE_APP_NAME = 'CHANGE_APP_NAME',
    ADD_CLICK = 'ADD_CLICK'
}

export interface GlobalMethods {
    sumClick: () => void;
}

export interface GlobalStore {
    state:      GlobalState;
    methods:    GlobalMethods;
}