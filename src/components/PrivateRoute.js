import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, auth, ...props }) => {
    return (
        <Route
            {...props}
            render={props => {
                if (auth.isLoading) {
                    return null;
                } else if (!auth.isAuthenticated) {
                    return <Redirect to='/' />
                } else {
                    return <Component {...props} />;
                }
            }}
        />
    )
}
PrivateRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute)
