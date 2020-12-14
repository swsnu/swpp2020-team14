import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import FontDetail from './FontDetail';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('FontDetail', () => {
  const fid = 1;
  const FontDetailInner = FontDetail;
  const mock_history = { goBack: jest.fn() };
  const mocked_font = {
    id: fid,
    name: 'TEST_NAME',
    manufacturer_name: 'TEST_MANUFACTURER',
    license: {
      is_free: false,
      license_detail: 'TEST_DETAIL',
    },
  };
  const mocked_free_font = {
    id: fid,
    name: 'TEST_NAME',
    manufacturer_name: 'TEST_MANUFACTURER',
    license: {
      is_free: true,
      license_detail: 'TEST_DETAIL',
    },
  };

  afterEach(() => jest.clearAllMocks());

  it('should display loading message when not loaded', () => {
    const comp = shallow(<FontDetailInner font_id={fid} />);
    const msg = comp.find('p');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch font', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual(`/api/font/${fid}`);
      rej(); done();
    }));

    shallow(<FontDetailInner font_id={fid} history={mock_history} />,
      { disableLifecycleMethods: false });
  });

  describe('with mock data', () => {
    let comp;

    it('should display all required items', async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_font });
      comp = shallow(<FontDetailInner font_id={fid} history={mock_history} />,
        { disableLifecycleMethods: false });
      while (comp.first().type() === 'p') {
        await new Promise((resv) => setTimeout(resv, 100));
      }

      expect(comp.find('.font-detail').length).toBe(1);
      expect(comp.find('.manufacturer').length).toBe(1);
      expect(comp.find('.license').length).toBe(1);
      expect(comp.find('.license-nonfree').length).toBe(1);
    });

    it('should display all required items for free font', async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_free_font });
      comp = shallow(<FontDetailInner font_id={fid} history={mock_history} />,
        { disableLifecycleMethods: false });
      while (comp.first().type() === 'p') {
        await new Promise((resv) => setTimeout(resv, 100));
      }

      expect(comp.find('.font-detail').length).toBe(1);
      expect(comp.find('.manufacturer').length).toBe(1);
      expect(comp.find('.license').length).toBe(1);
      expect(comp.find('.license-free').length).toBe(1);
    });
  });
});
