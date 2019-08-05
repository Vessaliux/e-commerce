import React from 'react';
import { useAlert } from 'react-alert';

import { connect } from 'react-redux';

// Hook
function usePrevious(value) {
    const ref = React.useRef();

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

const Alerts = ({ error }) => {
    const alert = useAlert();
    const prevError = usePrevious(error);

    React.useEffect(() => {
        if (error !== prevError && error.status != null) {
            alert.error("There is an error");
        }
    }, [error])

    return (
        <React.Fragment />
    )
}

const mapStateToProps = state => ({
    error: state.errors
});

export default connect(mapStateToProps)(Alerts);
