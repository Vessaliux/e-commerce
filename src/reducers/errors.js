import { GET_ERRORS } from '../actions/types';

const initialState = {
    header: '',
    msg: '',
    status: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                header: action.payload.header,
                msg: action.payload.msg,
                status: action.payload.status
            }
        default:
            return state;
    }
}
