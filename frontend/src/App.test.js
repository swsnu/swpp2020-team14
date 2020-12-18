import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import { mount } from 'enzyme';
import App from './App';

import loginReducer from './sign/reducers/reducers';

export const history = createBrowserHistory();

jest.mock('./mainpage/views/MainpageView', () => {
  return jest.fn(props => {
    return (
      <div className="spy-main-page">
        {Main}
      </div>);
  });
});
jest.mock('./mypage/views/mypage', () => {
  return jest.fn(props => {
    return (
      <div className="spy-my-page">
        {Main}
      </div>);
  });
});
jest.mock('./sign/views/SigninView', () => {
  return jest.fn(props => {
    return (
      <div className="spy-signin-page">
        {Signin}
      </div>);
  });
});
jest.mock('./common/NavigationBar', () => {
  return jest.fn(props => {
    return (
      <div className="spy-navi">
        {Navi}
      </div>);
  })
})

describe('App', () => {
  const reducer = combineReducers({
    login: loginReducer,
  });
  const mockStore = createStore(reducer);
  let app;

  beforeEach(() => {
    history.location.pathname = '/';

    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(app);
    expect(component.find('.spy-main-page').length).toBe(1);
  });

  it('should handle authorized route before login', () => {
    mockStore.dispatch({ 
      type: 'UPDATE_LOGIN', 
      data: {
        logged_in: false,
      }
    })
    history.replace('/my-page')
    const component = mount(app);
    expect(component.find('.spy-signin-page').length).toBe(1);
  })

  it('should handle unauthorized route before login', () => {
    history.replace('/my-page')
    const component = mount(app);
    expect(component.find('.spy-signin-page').length).toBe(1);
  })

  it('should handle authorized route after login', () => {
    mockStore.dispatch({ 
      type: 'UPDATE_LOGIN', 
      data: {
        logged_in: true,
      }
    })
    history.replace('my-page')
    const component = mount(app);
    expect(component.find('.spy-my-page').length).toBe(1);
  })

  it('should handle unauthorized route after login', () => {
    history.replace('/signin')
    const component = mount(app);
    expect(component.find('.spy-main-page').length).toBe(1);
  })
  
});
