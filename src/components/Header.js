import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { logout } from '../actions/auth';

import {
    Collapse,
    Navbar, NavbarToggler, NavbarBrand,
    Nav, NavItem, NavLink,
    UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

const Header = ({ auth, logout, handleLoginClick = () => { } }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    let component;
    if (auth.isAuthenticated) {
        component = (
            <React.Fragment>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>{auth.user.name}</DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href='/editprofile'>Edit Profile</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={logout}>Logout</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </React.Fragment>
        );
    } else {
        component = (
            <React.Fragment>
                <NavItem>
                    <NavLink href='#' onClick={handleLoginClick}>Login</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to='/register'>Register</NavLink>
                </NavItem>
            </React.Fragment>
        );
    }

    return (
        <Navbar color='secondary' dark expand='md'>
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
    logout: PropTypes.func.isRequired,
    handleLoginClick: PropTypes.func
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
