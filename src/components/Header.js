import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { fetchCart } from '../actions/cart';

import {
    Badge,
    Button,
    Collapse,
    Navbar, NavbarToggler, NavbarBrand,
    Nav, NavItem, NavLink,
    UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

const Header = ({ auth, cart, logout, fetchCart, onLoginClick, ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [cartBadge, setCardBadge] = React.useState(0);

    React.useEffect(() => {
        if (auth.isAuthenticated && auth.isLoading !== null && !auth.isLoading && auth.user.is_admin === '0') {
            fetchCart();
        }
    }, [auth]);

    React.useEffect(() => {
        if (cart.items) {
            let count = 0;
            for (const item of Object.values(cart.items)) {
                count += parseInt(item.quantity);
            }
            setCardBadge(count);
        }
    }, [cart]);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    let component;
    if (auth.isAuthenticated) {
        component = (
            <React.Fragment>
                <ion-icon size='large' name='person' style={{ color: 'white', margin: 'auto 0' }}></ion-icon>
                <UncontrolledDropdown className='mr-2' nav inNavbar>
                    <DropdownToggle nav caret className='pl-0'>{auth.user.name}</DropdownToggle>
                    <DropdownMenu right>
                        {auth.user.is_admin === '1' && <DropdownItem tag={Link} to='/manageproducts'>Manage Products</DropdownItem>}
                        <DropdownItem tag={Link} to='/editprofile'>Edit Profile</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={logout}>Logout</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                {auth.user.is_admin === '0' &&
                    <React.Fragment>
                        <Link to='#' onClick={props.cartToggle} style={{ marginTop: '0.3rem', height: '2rem', cursor: 'pointer' }}>
                            <ion-icon size='large' name='cart' style={{ color: 'white', margin: 'auto 0' }}></ion-icon>
                        </Link>
                        <Badge className={cartBadge === 0 ? 'd-none' : null} color='danger' style={{ height: '100%' }}>{cartBadge}</Badge>
                    </React.Fragment>}
            </React.Fragment>
        );
    } else {
        component = (
            <React.Fragment>
                <NavItem>
                    <NavLink href='#' onClick={onLoginClick}>Login</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to='/register'>Register</NavLink>
                </NavItem>
            </React.Fragment>
        );
    }

    if (auth.isLoading === null || auth.isLoading) {
        component = null;
    }

    return (
        <Navbar style={{ position: 'fixed', width: '100%', zIndex: 10, top: 0 }} color='secondary' dark expand='md'>
            <NavbarBrand tag={Link} to='/'>E-Commerce</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className='ml-auto' navbar>
                    {component}
                </Nav>
            </Collapse>
        </Navbar>
    )
}
Header.propTypes = {
    auth: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    fetchCart: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    cart: state.cart.cart
});

export default connect(mapStateToProps, { logout, fetchCart })(Header);
