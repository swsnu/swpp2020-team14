import React from 'react';
import { shallow } from 'enzyme';
import PhotoDetail from '../components/PhotoDetail';
import PhotoDetailView from './PhotoDetailView';

describe('PhotoDetailView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<PhotoDetailView.WrappedComponent
      history={hist}
      match={{ params: { photo_id: 3 } }}
    />);
    const detail = comp.find(PhotoDetail);
    expect(detail.length).toBe(1); // since only 1 comment is owned
    expect(detail.prop('photo_id')).toEqual(3);
  });

  it('should call goBack properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<PhotoDetailView.WrappedComponent
      history={hist}
      match={{ params: { photo_id: 3 } }}
    />);
    comp.find('.back').simulate('click');
    expect(hist.goBack).toHaveBeenCalledTimes(1);
  });
});
