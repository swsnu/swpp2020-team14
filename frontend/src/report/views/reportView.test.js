import React from 'react';
import { shallow } from 'enzyme';
import PhotoReport from '../components/PhotoReport';
import FindingList from '../components/FindingList';
import ReportView from './reportView';

describe('ReportView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { push: jest.fn() };
    const comp = shallow(<ReportView.WrappedComponent
      history={hist}
      match={{ params: { photo_id: 3 } }}
    />);
    const photoReport = comp.find(PhotoReport);
    expect(photoReport.length).toBe(1);
    expect(photoReport.prop('photo_id')).toEqual(3);
    const finding = comp.find(FindingList);
    expect(finding.length).toBe(1);
    expect(finding.prop('photo_id')).toEqual(3);
  });

  it('should call goBack properly', () => {
    const hist = { push: jest.fn() };
    const comp = shallow(<ReportView.WrappedComponent
      history={hist}
      match={{ params: { photo_id: 3 } }}
    />);
    comp.find('.back').simulate('click');
    expect(hist.push).toHaveBeenCalledTimes(1);
  });
});
