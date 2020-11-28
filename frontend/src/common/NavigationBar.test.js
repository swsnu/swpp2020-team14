import React from 'react';
import { shallow, mount } from 'enzyme';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import axios from 'axios';
import loginReducer from '../sign/reducers/reducers';
import { updateLogin } from '../sign/actions/actions';
import NavigationBar from './NavigationBar';

describe('Navigation bar', () => {
  const reducer = combineReducers({
    login: loginReducer,
  });
  const mockStore = createStore(reducer);

  const navi = (
    <BrowserRouter>
      <NavigationBar.WrappedComponent login={{ logged_in: true, user_info: false }} />
    </BrowserRouter>
  );

  it('should render without error', () => {
    const component = mount(navi);
    expect(component.find('.navi').length).toBe(1);
  });

  it('should handle signout', () => {
    // TODO
    axios.get = jest.fn();
    axios.post = jest.fn();
    const component = mount(navi);
    const button = component.find('.btn-signout');
    expect(button.length).toBe(1);
    button.simulate('click');
  });
});
