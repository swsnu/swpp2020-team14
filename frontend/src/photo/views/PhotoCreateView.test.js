import React from 'react';
import { shallow } from 'enzyme';
import PhotoEdit from '../components/PhotoEdit';
import PhotoCreateView from './PhotoCreateView';

describe("PhotoCreateView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<PhotoCreateView.WrappedComponent />);
    const edit = comp.find(PhotoEdit);
    expect(edit.length).toBe(1); 
  })
});