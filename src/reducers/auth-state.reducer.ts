import { Reducer, AnyAction } from 'redux';

import { AppAction, IAppState } from '../store';

export const authStateReducer: Reducer<IAppState, AnyAction> = (state: IAppState | undefined, action: AnyAction): IAppState => {
    switch (action.type) {
        case AppAction.AUTHORIZE:
            return {
                authorized: true
            };
        case AppAction.UNAUTHORIZE:
            return {
                authorized: false
            };
        default:
            return state ? state : {authorized: false};
    }
};
