import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import FontList from './FontList';
import FontItem from './FontItem';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('FontList', () => {
  const FontListInner = FontList.WrappedComponent;
  const mock_history = { push: jest.fn() };
  const mocked_data = {
    pages: 1,
    cur: 1,
    list: [
      {
        id: 1,
        name: 'TEST_NAME1',
        manufacturer_name: 'TEST_MANUFACTURER1',
        license: {
          is_free: false,
          license_detail: 'TEST_DETAIL1',
        },
      },
      {
        id: 2,
        name: 'TEST_NAME2',
        manufacturer_name: 'TEST_MANUFACTURER2',
        license: {
          is_free: false,
          license_detail: 'TEST_DETAIL2',
        },
      },
      {
        id: 3,
        name: 'TEST_NAME3',
        manufacturer_name: 'TEST_MANUFACTURER3',
        license: {
          is_free: true,
          license_detail: 'TEST_DETAIL3',
        },
      },
    ],
  };

  afterEach(() => jest.clearAllMocks());

  it('should display loading message when not loaded', () => {
    const comp = shallow(<FontListInner />);
    const msg = comp.find('.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual('/api/font?page=1');
      rej(); done();
    }));

    shallow(<FontListInner history={mock_history} fetchEndpoint="/api/font"/>,
      { disableLifecycleMethods: false });
  });

  it('should display all items', async () => {
    axios.get.mockResolvedValueOnce({ data: mocked_data });
    const comp = shallow(<FontListInner history={mock_history} />,
      { disableLifecycleMethods: false });
    while (comp.first().type() === 'p') {
      await new Promise((resv) => setTimeout(resv, 100));
    }

    const fonts = comp.find(FontItem);
    expect(fonts.length).toBe(mocked_data.list.length);
  });

  // it('should redirect to detail page', async () => {
  //   axios.get.mockResolvedValueOnce({ data: mocked_data });
  //   const comp = shallow(<FontListInner history={mock_history} />,
  //     { disableLifecycleMethods: false });
  //   while (comp.first().type() === 'p') {
  //     await new Promise((resv) => setTimeout(resv, 100));
  //   }

  //   const fonts = comp.find('.font-list-table tbody tr');
  //   const btn = fonts.at(0).find('button');

  //   btn.simulate('click');
  //   expect(mock_history.push).lastCalledWith('/font/1');
  // });
});
