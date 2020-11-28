import React from 'react';
import { shallow, mount } from 'enzyme';
import signin from '../components/signin';
import SigninView from './SigninView';
import axios from 'axios';

describe("SigninView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<SigninView.WrappedComponent />);
    const sn = comp.find(signin);
    expect(sn.length).toBe(1); 
  })

  it('should submit signin form', async () => {
    let func = jest.fn()
    const comp = mount(<SigninView.WrappedComponent />)
    const form = comp.find(".signin form");
    comp.state().email = "TEST_EMAIL"
    comp.state().password = "TEST_PASSWORD"
    expect(form.length).toBe(1);
    axios.get = jest.fn(url => 0);
    axios.post = jest.fn((url, data) => {data: "hello"});

    await comp.instance().loginAttempt({email: "TEST_EMAIL", password: "TEST_PASSWORD"})
    await comp.instance().loginAttempt({email: "", password: ""})

    
    // expect(func).toHaveBeenCalledWith({email: "TEST_EMAIL", password: "TEST_PASSWORD"})
  })
});