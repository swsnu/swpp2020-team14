import { UPDATE_LOGIN } from '../actions/actionTypes';

const initialState = {
  logged_in: (window.localStorage.getItem('login.logged_in') != null),
  user_info: JSON.parse(window.localStorage.getItem('login.user_info')),
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGIN:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}
