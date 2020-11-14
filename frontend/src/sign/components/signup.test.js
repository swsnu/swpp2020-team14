import React from 'react'
import axios from 'axios'
import { shallow } from 'enzyme'

import Signup from './signup'

jest.mock('axios')
jest.spyOn(window, 'alert');

describe('Signup', () => {
	it('should handle changes', async () => {
    const comp = shallow(<Signup.WrappedComponent errorMessage={null}/>)
    const input_email = comp.find('.row-email input')
    expect(input_email.length).toBe(1)
    input_email.simulate('change', { target : { name: "email", value: "TEST_EMAIL"}})

    const input_password = comp.find('.row-password input')
    expect(input_password.length).toBe(1)
	input_password.simulate('change', { target : { name: "password", value: "TEST_PASSWORD"}})
	
	const input_nickname = comp.find('.row-nickname input')
    expect(input_nickname.length).toBe(1)
    input_email.simulate('change', { target : { name: "nickname", value: "TEST_NICKNAME"}})

    while (comp.instance().state.email != "TEST_EMAIL")
      await new Promise(r => setTimeout(r, 100));
    while (comp.instance().state.password != "TEST_PASSWORD")
	  await new Promise(r => setTimeout(r, 100));
	while (comp.instance().state.nickname != "TEST_NICKNAME")
      await new Promise(r => setTimeout(r, 100));
  })

  it('should have error message', () => {
	const comp = shallow(<Signup.WrappedComponent />, 
		{ disableLifecycleMethods: false })
	comp.setState({errorMessage: "TEST_ERROR"})
	const error = comp.find('.row-error-message')
    expect(error.length).toBe(1)
  })

  it('should submit signup form', async () => {
	const comp = shallow(<Signup.WrappedComponent errorMessage={null}/>)
	const form = comp.find(".signup form");

	axios.get.mockResolvedValueOnce({ data: {}});
	axios.post.mockResolvedValueOnce({ data: {}});
	await new Promise(r => comp.setState({ email: "TEST_EMAIL", password: "TEST_PASSWORD", nickname: "TEST_NICKNAME" }, r))
        .then(() => form.simulate("submit", { preventDefault: () => {}}));
  })
})