import axios from 'axios';
import { USER_LOADED, USER_LOADING, AUTH_ERROR, AUTH_LOGIN, GET_ERRORS, LOGOUT_SUCCESS, NOTIFY } from './types';

// FETCH & LOAD USER USING EMAIL & PASSWORD
export const fetchUser = (email, password, remember) => (dispatch) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/login', { email, password, remember })
            .then(res => {
                let data = {
                    token: res.data.token,
                    user: res.data.user
                }
                dispatch({
                    type: AUTH_LOGIN,
                    payload: data
                });

                resolve();
            }).catch(err => {
                console.log(err.response);
                const error = {
                    msg: err.response.data.error,
                    status: err.response.status
                }

                dispatch({
                    type: AUTH_ERROR
                })

                reject(error);
            });
    });
}

// REGISTER USER
export const registerUser = (fields) => (dispatch) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/register', fields)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                resolve(data);
            }).catch(err => {
                let msg;
                if (typeof err.response.data.error === 'object') {
                    msg = Object.values(err.response.data.error).join(" ");
                } else {
                    msg = err.response.data.error;
                }

                const error = {
                    header: 'register',
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}

// FETCH & LOAD USER USING ACCESS TOKEN
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // If token exists, add to headers config
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    axios.get('/api/auth/user', config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data.user
            });
        })
        .catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
        });
}

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // If token exists, add to headers config
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    axios.get('/auth/logout/', config)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            });
        })
        .catch(err => {
            // logout error
        });
}
