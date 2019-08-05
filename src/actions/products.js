import axios from 'axios';
import { GET_PRODUCTS, GET_PRODUCT } from './types';

// GET PRODUCTS
export const getProducts = () => dispatch => {
    axios.get('/api/products')
        .then(res => {
            dispatch({
                type: GET_PRODUCTS,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}

// GET A SINGLE PRODUCT BASED ON ID
export const getProduct = (productId) => dispatch => {
    axios.get(`/api/products/${productId}`)
        .then(res => {
            dispatch({
                type: GET_PRODUCT,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}

// UPDATE A PRODUCT
export const updateProduct = (productId, fields) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        axios.put(`/api/products/${productId}`, fields, config)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                dispatch({
                    type: GET_PRODUCTS,
                    payload: res.data.products
                });

                resolve(data);
            }).catch(err => {
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

// UPLOAD A PRODUCT IMAGE
export const uploadProductImage = (formData) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        axios.post(`/api/products/upload-image`, formData, config)
            .then(res => {
                const data = {
                    image: res.data.image,
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
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}

// ADD A NEW PRODUCT
export const insertProduct = (fields) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // placeholder
        fields.description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium incidunt eius dolores ratione, possimus amet animi consequuntur inventore labore, doloremque ut. Delectus repudiandae, dignissimos quidem ullam velit eum perspiciatis consequatur.';

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        axios.post(`/api/products`, fields, config)
            .then(res => {
                const data = {
                    msg: res.data.msg,
                    status: res.status
                }

                dispatch({
                    type: GET_PRODUCTS,
                    payload: res.data.products
                });

                resolve(data);
            }).catch(err => {
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

// DELETE A PRODUCT
export const deleteProduct = (productId) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getState().auth.token}`
        }
    }

    axios.delete(`/api/products/${productId}`, config)
        .then(res => {
            dispatch({
                type: GET_PRODUCTS,
                payload: res.data.products
            });
        }).catch(err => {
            /*let msg;
            if (typeof err.response.data.error === 'object') {
                msg = Object.values(err.response.data.error).join(" ");
            } else {
                msg = err.response.data.error;
            }

            const error = {
                msg,
                status: err.response.status
            }*/

            console.log(err.response);
        });
}
