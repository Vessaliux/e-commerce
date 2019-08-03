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
