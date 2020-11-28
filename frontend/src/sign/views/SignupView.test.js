import React from 'react';
import { shallow } from 'enzyme';
import signup from '../components/signup';
import SignupView from './SignupView';

describe('SignupView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<SignupView.WrappedComponent />);
    const sn = comp.find(signup);
    expect(sn.length).toBe(1);
  });
});
