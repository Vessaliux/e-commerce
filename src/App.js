import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { StripeProvider } from 'react-stripe-elements';
import './styles/App.css';

import { Provider } from 'react-redux';
import store from './store';

import Drawer from 'react-motion-drawer';
import Main from './components/Main';

setConfig({
    showReactDomPatchNotification: false
})

function App() {
    return (
        <StripeProvider apiKey='pk_test_9sUBSVBWM6tjSGtRKAHZWMQC00iTXRbIXZ'>
            <Provider store={store}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </Provider >
        </StripeProvider>
    );
}

export default hot(module)(App);
