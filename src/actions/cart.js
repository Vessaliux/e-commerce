import axios from 'axios';
import { GET_CART } from './types';

// GET CART
export const fetchCart = () => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getState().auth.token}`
        }
    }

    axios.post(`/api/users/${getState().auth.user.id}/cart`, null, config)
        .then(res => {
            dispatch({
                type: GET_CART,
                payload: res.data.cart
            });
        })
        .catch(err => console.log(err));
}

// ADD A PRODUCT TO THE CART
export const insertIntoCart = (productId, quantity = 1) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        const data = {
            product_id: productId,
            quantity
        }

        axios.post(`/api/carts/${getState().cart.cart.id}`, data, config)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                dispatch({
                    type: GET_CART,
                    payload: res.data.cart
                });

                resolve(data);
            }).catch(err => {
                console.log(err.response);
                let msg;
                if (typeof err.response.data.error === 'object') {
                    msg = Object.values(err.response.data.error).join(" ");
                } else {
                    msg = err.response.data.error;
                }

                const error = {
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}

// REMOVE A PRODUCT FROM THE CART
export const removeFromCart = (productId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        const data = {
            product_id: productId
        }

        axios.post(`/api/carts/${getState().cart.cart.id}/remove`, data, config)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                dispatch({
                    type: GET_CART,
                    payload: res.data.cart
                });

                resolve(data);
            }).catch(err => {
                console.log(err.response);
                let msg;
                if (typeof err.response.data.error === 'object') {
                    msg = Object.values(err.response.data.error).join(" ");
                } else {
                    msg = err.response.data.error;
                }

                const error = {
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}

// CHECKOUT CART
export const cartCheckout = token => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        axios.post('/api/stripe', token.id, config)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                resolve(data);
            }).catch(err => {
                console.log(err.response);
                let msg;
                if (typeof err.response.data.error === 'object') {
                    msg = Object.values(err.response.data.error).join(" ");
                } else {
                    msg = err.response.data.error;
                }

                const error = {
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}
