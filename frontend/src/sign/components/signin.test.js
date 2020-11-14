import React from 'react'
import { shallow } from 'enzyme'

import Signin from './signin'

jest.spyOn(window, 'alert');

describe('Signin', () => {
	it('should handle changes', async () => {
    const comp = shallow(<Signin loginAttempt={ jest.fn() } errorMessage={null}/>)
    const input_email = comp.find('.row-email input')
    expect(input_email.length).toBe(1)
    input_email.simulate('change', { target : { name: "email", value: "TEST_EMAIL"}})

    const input_password = comp.find('.row-password input')
    expect(input_password.length).toBe(1)
    input_password.simulate('change', { target : { name: "password", value: "TEST_PASSWORD"}})

    while (comp.state().email != "TEST_EMAIL")
      await new Promise(r => setTimeout(r, 100));
    while (comp.state().password != "TEST_PASSWORD")
      await new Promise(r => setTimeout(r, 100));
  })

  it('should have error message', () => {
    const comp = shallow(<Signin loginAttempt={ jest.fn() } errorMessage="TEST_ERROR"/>)
    const error = comp.find('.row-error-message')
    expect(error.length).toBe(1)
  })

  it('should submit signin form', async () => {
    let func = jest.fn()



    const comp = shallow(<Signin loginAttempt={ func } errorMessage={null}/>)
    const form = comp.find(".signin form");
    comp.state().email = "TEST_EMAIL"
    comp.state().password = "TEST_PASSWORD"

    form.simulate("submit", { preventDefault: () => {}})
    expect(func).toHaveBeenCalledWith({email: "TEST_EMAIL", password: "TEST_PASSWORD"})
  })
})