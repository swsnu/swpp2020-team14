import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoReport from './PhotoReport';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoReport', () => {
  const pid = 3;
  const PhotoReportInner = PhotoReport;

  it('should show loading message when not loaded', () => {
    const comp = shallow(<PhotoReportInner photo_id={pid} />);
    const msg = comp.find('.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch photo report', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual(`/api/photo/${pid}/report`);
      rej(); done();
    }));

    const comp = shallow(<PhotoReportInner photo_id={pid} />,
      { disableLifecycleMethods: false });
  });
});
