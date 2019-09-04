import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.sass';

import NavbarComponent from './layout/navbar/navbar.component';
import CitationsComponent from './pages/citations/citations.component';
import AuthorsComponent from './pages/authors/authors.component';

class App extends React.Component {
    public render() {
        return (
          <div className="App">
              <BrowserRouter>
                  <NavbarComponent />
                  <Switch>
                      <Route exact path='/' component={CitationsComponent} />
                      <Route exact path='/authors' component={AuthorsComponent} />
                  </Switch>
              </BrowserRouter>
          </div>
        );
    }
}

export default App;
