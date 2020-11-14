import React from 'react';
import { shallow } from 'enzyme';
import signin from '../components/signin';
import SigninView from './SigninView';

describe("SignipView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<SigninView.WrappedComponent />);
    const sn = comp.find(signin);
    expect(sn.length).toBe(1); 
  })
});