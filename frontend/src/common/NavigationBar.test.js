import React from 'react'
import { shallow } from 'enzyme'
import { mount } from 'enzyme';

import NavigationBar from './NavigationBar'
import { updateLogin } from '../sign/actions/actions';
import { createStore, combineReducers } from 'redux';
import loginReducer from '../sign/reducers/reducers'
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

describe("Navigation bar", () => {
  const reducer = combineReducers({
    login: loginReducer
  })
  const mockStore = createStore(reducer);

  const navi = (
    <BrowserRouter>
      <NavigationBar.WrappedComponent login={{logged_in: true, user_info: false}}/>
    </BrowserRouter>
  );


  it(`should render without error`, () => {
    const component = mount(navi);
    expect(component.find('.navi').length).toBe(1);
  });

  it(`should render without error if not logged in`, () => {
    
    const navi = (
      <BrowserRouter>
        <NavigationBar.WrappedComponent login={{logged_in: false, user_info: false}}/>
      </BrowserRouter>
    );

    const component = mount(navi);
    expect(component.find('.navi').length).toBe(1);

  });

  it(`should handle signout`, (done) => {
    // TODO
    axios.get = jest.fn();
    axios.post = jest.fn();
    const component = mount(navi);
    const button = component.find('.btn-signout');
    expect(button.length).toBe(1);
    console.log("before");
    button.simulate('click');
    done();

  })
  
})