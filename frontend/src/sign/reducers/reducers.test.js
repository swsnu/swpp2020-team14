import reducer from './reducers';
import { UPDATE_LOGIN } from '../actions/actionTypes';

const stubData = {
  logged_in: true,
  user_info: 'TEST_INFO',
};

describe('Reducers', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({
      logged_in: (window.localStorage.getItem('login.logged_in') != null),
      user_info: JSON.parse(window.localStorage.getItem('login.user_info')),
    });
  });

  it('should update login', () => {
    const newState = reducer(undefined, {
      type: UPDATE_LOGIN,
      data: stubData,
    });
    expect(newState).toEqual({ logged_in: true, user_info: 'TEST_INFO' });
  });
});
