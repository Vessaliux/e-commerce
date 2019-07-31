import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './styles/App.css';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Header from './components/Header';
import Register from './components/Register';

function App() {
    return (
        <Provider store={store}>
            <Header />
            <div className='mt-4'></div>
            <Container>
                <Col md={{ span: 6, offset: 3 }}>
                    <Register />
                </Col>
            </Container>
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
