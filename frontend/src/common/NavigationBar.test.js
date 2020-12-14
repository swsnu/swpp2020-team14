import React from 'react'

import { createShallow, createMount } from '@material-ui/core/test-utils';

import NavigationBar from './NavigationBar'
import axios from 'axios';

jest.mock('axios');

describe("Navigation bar", () => {
  const shallow = createShallow({ disableLifecycleMethods: false });
  const mount = createMount();

  const navi = (
    <NavigationBar.WrappedComponent
      login={ {
        logged_in: true,
        user_info: {
          email: 'a@b.com',
          nickname: 'nick'
        } } }
      history={ { location: { pathname: '/' } } }
      updateLogin={ jest.fn() } />
  );

  it(`should render without error`, () => {
    const component = shallow(navi);
    expect(component.find('.navbar').length).toBe(1);
  });

  it(`should render without error if not logged in`, () => {
    <NavigationBar.WrappedComponent
      login={{logged_in: true, user_info: false}}
      history={ { location: { pathname: '/' } } }
    />
    const component = shallow(navi);
    expect(component.find('.navbar').length).toBe(1);
  });

  it(`should handle signout`, (done) => {
    const component = mount(navi);
    const button = component.find('li[role="menuitem"]');
    expect(button.length).toBe(1);
    button.simulate('click');
    done();
  });
})