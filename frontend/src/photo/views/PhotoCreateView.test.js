import React from 'react';
import { shallow } from 'enzyme';
import PhotoCreate from '../components/PhotoCreate';
import PhotoCreateView from './PhotoCreateView';

describe('PhotoCreateView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<PhotoCreateView.WrappedComponent />);
    const create = comp.find(PhotoCreate);
    expect(create.length).toBe(1);
  });
});
