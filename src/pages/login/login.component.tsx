import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Button, Card, Form } from 'react-bootstrap';

import { API } from '../../api/api';
import { AppAction, store } from '../../store';

interface IAuthData {
    login    : string;
    passw    : string;
    remember : boolean;
}

// the component to represent an authorization page
class LoginComponent extends React.Component<RouteComponentProps> {
    // authorization data
    private authData: IAuthData = {
        login    : '',
        passw    : '',
        remember : true
    };

    // component constructor
    public constructor(props: any) {
        super(props);

        this.authorize = this.authorize.bind(this);
    }

    // component initialization hook
    public componentDidMount(): void {
    }

    // authorize a user by login and password been specified
    public authorize(): void {
        // +++++ VERIFY LOGIN AND PASSW
        API.authorize(this.authData.login, this.authData.passw)
            .then((result: boolean) => {
                if (result) {
                    store.dispatch({
                        type: AppAction.AUTHORIZE
                    });
                    this.props.history.push('/');
                } else {
                    console.info('--UNAUTHORIZED-->>');
                }
            });
    }

    // component output
    public render(): JSX.Element | null {
        const handleInput = (evt: any) => {
            switch (evt.target.name) {
                case 'login':
                    this.authData.login = evt.target.value;
                    break;
                case 'passw':
                    this.authData.passw = evt.target.value;
                    break;
                case 'remember':
                    this.authData.remember = evt.target.checked;
                    break;
                default:
                    // Nothing!
            }
        };

        return (
            <div className="d-flex d-flex__login justify-content-center align-items-center">
                <Card>
                    <Card.Header as="h5">Авторизация</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    onChange={handleInput}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="password"
                                    name="passw"
                                    placeholder="Пароль"
                                    onChange={handleInput}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    name="remember"
                                    label="запомнить меня"
                                    checked={this.authData.remember}
                                    onChange={handleInput}
                                />
                            </Form.Group>
                            <Form.Group className="text-center mt-4">
                                <Button variant="info" size="sm" onClick={this.authorize}>OK</Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default withRouter(LoginComponent);
