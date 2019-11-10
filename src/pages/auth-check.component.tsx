import React from 'react';
import { Redirect } from 'react-router-dom';

import { store } from '../store';

interface ILoginURL {
    loginURL: string;
}

interface IComponent {
    component: JSX.Element | null;
}

interface IAuthorized {
    authorized: boolean;
}

// authorization check component
export default class AuthCheckComponent extends React.Component<ILoginURL & IComponent, IAuthorized> {
    // component constructor
    public constructor(props: any) {
        super(props);

        this.state = {
            authorized: store.getState().authorized
        };
        console.info('--AUTHORIZED-->> ' + this.state.authorized); // @@@@@
    }

    // component output
    public render(): JSX.Element | null {
        if (!this.state.authorized) {
            return(<Redirect to={this.props.loginURL} />);
        } else {
            return (this.props.component);
        }
    }
}
