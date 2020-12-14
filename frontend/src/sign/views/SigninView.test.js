import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';

import Signin from '../components/signin';
import SigninView from './SigninView';

import { updateLogin } from '../actions/actions';
import { mount } from 'enzyme';

jest.mock('../actions/actions')
jest.mock('axios')

describe('<LoginPage />', () => {
	let loginPage
	beforeEach(() => {
		const UnauthorizedRoute = ({ component, ...rest}) => {
			if (props.login.logged_in === false) {
			  return <Route {...rest} component={ component } />;
			}
			return <Redirect to="/" />;
      };
      
	  loginPage = (
      <UnauthorizedRoute exact path="/signin" component={SigninView} />
	  );
	  updateLogin.mockImplementationOnce((data) => { return dispatch => {}; });
	})
  
	afterEach(() => { jest.clearAllMocks() });
  
	it(`should render LoginPage`, () => {
	  const components = mount(loginPage);
	  const wrapper = components.find('Signin');
	  expect(wrapper.length).toBe(1);
	})
  
	it('should attempt to fetch token', (done) => {
		axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
				expect(url).toEqual(`/api/token`);
				rej(); done();
		}));

		mount(loginPage)
	});

});
