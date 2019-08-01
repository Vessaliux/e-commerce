import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles/App.css';

import { Provider, connect } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Home from './components/Home';
import LoginModal from './components/LoginModal';
import Register from './components/Register';
import GenericNotFound from './components/GenericNotFound';

function App() {
    const [showLoginModal, setShowLoginModal] = React.useState(false);

    React.useEffect(() => {
        store.dispatch(loadUser());
    });

    const handleLoginToggle = e => {
        setShowLoginModal(!showLoginModal);
    }

    return (
        <Provider store={store}>
            <Router>
                <React.Fragment>
                    <Header handleLoginClick={handleLoginToggle} />

                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/register' component={Register} />
                        <Route component={GenericNotFound} />
                    </Switch>

                    <LoginModal
                        isOpen={showLoginModal}
                        toggle={handleLoginToggle}
                    />
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
