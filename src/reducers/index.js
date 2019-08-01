import { combineReducers } from 'redux';
import products from './products';
import errors from './errors';
import auth from './auth';
import notification from './notification';

export default combineReducers({
    products,
    errors,
    auth,
    notification
});
