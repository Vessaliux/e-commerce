import React from 'react'
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadUser } from '../actions/auth';

import PrivateRoute from './PrivateRoute';
import Header from './Header';
import Home from './Home';
import LoginModal from './LoginModal';
import Register from './Register';
import EditProfile from './EditProfile';
import Product from './Product';
import CheckoutForm from './CheckoutForm';
import GenericNotFound from './GenericNotFound';

const Main = ({ auth, loadUser }) => {
    const [showLoginModal, setShowLoginModal] = React.useState(false);

    React.useEffect(() => {
        if (!auth.isLoading) {
            console.log('Auth');
            loadUser();
        }
    }, []);

    const handleLoginToggle = () => {
        setShowLoginModal(!showLoginModal);
    }

    // component set-up
    const component = auth.isLoading ? null : (
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/register' component={Register} />
                <PrivateRoute exact path='/editprofile' component={EditProfile} />
                <Route exact path='/products/:productId' render={props => <Product {...props} setShowLoginModal={setShowLoginModal} />} />
                <Route exact path='/checkout' render={props => <Elements><CheckoutForm /></Elements>} />
                <Route component={GenericNotFound} />
            </Switch>

            <LoginModal
                isOpen={showLoginModal}
                toggle={handleLoginToggle}
            />
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Header />
            {component}
        </React.Fragment>
    )
}
Main.propTypes = {
    auth: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { loadUser })(Main);
