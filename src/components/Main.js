import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadUser } from '../actions/auth';
import { fetchCart } from '../actions/cart';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import AdminHome from './AdminHome';
import ManageProduct from './ManageProduct';
import Header from './Header';
import Home from './Home';
import LoginModal from './LoginModal';
import Register from './Register';
import EditProfile from './EditProfile';
import Product from './Product';
import Checkout from './Checkout';
import GenericNotFound from './GenericNotFound';

let init = true;
const Main = ({ auth, cart, loadUser, fetchCart }) => {
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const [showCartModal, setShowCartModal] = React.useState(false);

    if (init) {
        init = false;
        loadUser();
    }

    React.useEffect(() => {
        if (auth.isAuthenticated && auth.isLoading !== null && !auth.isLoading && auth.user.is_admin === '0') {
            fetchCart();
        }
    }, [auth]);

    React.useEffect(() => {
        if (cart.items && cart.items.length === 0) {
            setShowCartModal(false);
        }
    }, [cart]);

    const handleLoginToggle = () => {
        setShowLoginModal(!showLoginModal);
    }

    const handleCartToggle = () => {
        if (cart.items && cart.items.length === 0) {
            setShowCartModal(false);
        } else {
            setShowCartModal(true);
        }
    }

    // component set-up
    const component = auth.isLoading || auth.isLoading === null ? null : (
        <React.Fragment>
            <Switch>
                {auth.isAuthenticated && auth.user.is_admin === '1' ? <AdminRoute exact path='/' component={AdminHome} /> : <Route exact path='/' component={Home} />}
                {auth.isAuthenticated && auth.user.is_admin === '1' ? <AdminRoute exact path='/manageproducts' component={ManageProduct} /> : <Route exact path='/manageproducts' render={props => <Redirect to='/' />} />}
                <Route exact path='/register' component={Register} />
                <PrivateRoute exact path='/editprofile' component={EditProfile} />
                <Route exact path='/products/:productId' render={props => <Product {...props} setShowLoginModal={setShowLoginModal} />} />
                <PrivateRoute exact path='/checkout' component={Checkout} />
                <Route component={GenericNotFound} />
            </Switch>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Header onLoginClick={handleLoginToggle} cartToggle={handleCartToggle} />
            <Checkout
                isOpen={showCartModal}
                toggle={() => {
                    handleCartToggle();
                    fetchCart();
                }}
            />
            {component}
            <LoginModal
                isOpen={showLoginModal}
                toggle={handleLoginToggle}
            />
        </React.Fragment>
    )
}
Main.propTypes = {
    auth: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    fetchCart: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    cart: state.cart.cart
});

export default connect(mapStateToProps, { loadUser, fetchCart })(Main);
