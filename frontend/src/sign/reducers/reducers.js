import { UPDATE_LOGIN } from '../actions/actionTypes';

const initialState = {
    logged_in: false,
    user_info: null
};

export default function loginReducer(state = initialState, action){
    switch (action.type){
        case UPDATE_LOGIN:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}