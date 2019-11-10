import { Store, createStore } from 'redux';
import { authStateReducer } from '../reducers/auth-state.reducer';

export enum AppAction {
    AUTHORIZE,
    UNAUTHORIZE
}

export interface IAppState {
    authorized: boolean;
}

// application initial state
const initialState: IAppState = {
    authorized: false
};

export const store: Store = createStore(authStateReducer, initialState);
