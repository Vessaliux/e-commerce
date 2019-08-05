import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AdminRoute = ({ component: Component, to, auth, ...props }) => {
    return (
        <Route
            {...props}
            render={props => {
                if (auth.isLoading) {
                    return null;
                } else if (!auth.isAuthenticated || auth.user.is_admin !== '1') {
                    return <Redirect to='/' />
                } else {
                    return <Component />;
                }
            }}
        />
    )
}
AdminRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    auth: PropTypes.object.isRequired,
    to: PropTypes.string
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(AdminRoute)
