import axios from 'axios';
import { GET_ERRORS, NOTIFY, UPDATE_USER } from './types';

// UPDATE PROFILE
export const updateProfile = (userId, fields) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        fields['_method'] = 'PATCH';

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getState().auth.token}`
            }
        }

        axios.post(`/api/users/${userId}`, fields, config)
            .then(res => {
                const data = {
                    header: 'edit_profile',
                    msg: 'Profile updated',
                    status: res.status
                }

                dispatch({
                    type: UPDATE_USER,
                    payload: fields
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
                    header: 'edit_profile',
                    msg,
                    status: err.response.status
                }

                reject(error);
            });
    });
}
