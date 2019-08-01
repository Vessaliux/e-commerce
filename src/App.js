import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './styles/App.css';

import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import GenericNotFound from './components/GenericNotFound';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <React.Fragment>
                    <Header />
                    <div className='mt-4'></div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/register" component={Register} />
                        <Route component={GenericNotFound} />
                    </Switch>
                </React.Fragment>
            </Router>
        </Provider>
    );

    /*return (
        <Provider store={store}>
            <Router>
                <div className='container'>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/products/:id" component={SingleProduct} />
                        <Route exact path="/confirmation" component={Confirmation} />
                        <Route exact path="/checkout" component={Checkout} />
                        <Route exact path="/dashbaord" component={Dashboard} />
                        <Route exact path="/admin/:page" component={Admin} />
                        <Route exact path="/admin" component={Admin} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );*/
}

export default hot(module)(App);
