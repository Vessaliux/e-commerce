import axios from 'axios';
import { GET_ERRORS, NOTIFY, UPDATE_USER } from './types';

// UPDATE PROFILE
export const updateProfile = (userId, fields) => (dispatch) => {
    axios.post(`/api/users/${userId}`, fields)
        .then(res => {
            const data = {
                header: 'edit_profile',
                msg: 'Profile updated',
                status: res.status
            }

            dispatch({
                type: NOTIFY,
                payload: data
            });

            dispatch({
                type: UPDATE_USER,
                payload: fields
            });
        }).catch(err => {
            let msg;
            if (typeof err.response.data.error === 'object') {
                msg = Object.values(err.response.data.error).join(" ");
            } else {
                msg = err.response.data.error;
            }

            const errors = {
                header: 'edit_profile',
                msg,
                status: err.response.status
            }

            dispatch({
                type: GET_ERRORS,
                payload: errors
            });
        });
}
