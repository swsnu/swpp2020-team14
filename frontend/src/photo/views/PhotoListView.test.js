import React from 'react';
import { shallow } from 'enzyme';
import PhotoList from '../components/PhotoList';
import PhotoListView from './PhotoListView';

describe("PhotoCreateView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<PhotoListView.WrappedComponent />);
    const list = comp.find(PhotoList);
    expect(list.length).toBe(1); 
  })
});