import React from 'react';
import { shallow } from 'enzyme';
import FontDetail from '../components/FontDetail';
import FontDetailView from './item';

describe('FontDetailView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<FontDetailView.WrappedComponent
      history={hist}
      match={{ params: { font_id: 3 } }}
    />);
    const detail = comp.find(FontDetail);
    expect(detail.length).toBe(1); // since only 1 comment is owned
    expect(detail.prop('font_id')).toEqual(3);
  });

  it('should call goBack properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<FontDetailView.WrappedComponent
      history={hist}
      match={{ params: { photo_id: 3 } }}
    />);
    comp.find('.back').simulate('click');
    expect(hist.goBack).toHaveBeenCalledTimes(1);
  });
});
