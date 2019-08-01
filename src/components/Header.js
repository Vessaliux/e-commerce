import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { logout } from '../actions/auth';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = ({ auth, logout, handleLoginClick = () => { } }) => {
    let component;

    if (auth.isAuthenticated) {
        component = (
            <React.Fragment>
                <Nav.Link>{auth.user.name}</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
            </React.Fragment>
        );
    } else {
        component = (
            <React.Fragment>
                <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
            </React.Fragment>
        );
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Nav>
                    {component}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

Header.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    handleLoginClick: PropTypes.func
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
