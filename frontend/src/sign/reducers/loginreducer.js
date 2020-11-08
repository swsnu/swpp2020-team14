// Reducer(which will be combined with others)
// Global initial state for sign page
const initialState = {
    isLoggedIn: false
};

export default function loginReducer(state = initialState, action){
    switch (action.type){
        case 'LOG_IN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true
            };
        case 'LOG_OUT_SUCCESS':
            return {
                ...state,
                isLoggedIn: false
            };
        default:
            return state;
    }
}