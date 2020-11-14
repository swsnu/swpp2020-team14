import React from 'react';
import { shallow } from 'enzyme';
import FontList from '../components/FontList';
import FontListView from './list';

describe("FontListView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<FontListView.WrappedComponent />);
    const flist = comp.find(FontList);
    expect(flist.length).toBe(1); 
  })
});