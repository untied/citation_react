import React from 'react';
import { RouteComponentProps, NavLink, withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';

import { Navbar, Nav } from 'react-bootstrap';

// the component to represent the main navigation menu
class NavbarComponent extends React.Component<RouteComponentProps> {
    // component output
    public render() {
        return (
            <Navbar bg="primary" variant="dark" fixed="top">
                <Navbar.Brand href="#!">
                    <FontAwesomeIcon icon={faBookReader} size="lg" fixedWidth /> ЦИТАТНИК
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <NavLink exact className="nav-link" activeClassName="active" to="/">Список цитат</NavLink>
                    <NavLink exact className="nav-link" activeClassName="active" to="/authors">Список авторов</NavLink>
                </Nav>
            </Navbar>
        );
    }
}

export default withRouter(NavbarComponent);
