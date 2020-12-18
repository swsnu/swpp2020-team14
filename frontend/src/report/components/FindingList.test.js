import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import FindingList from './FindingList';
import FontItem from '../../font/components/FontItem';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('FindingList', () => {
  const FindingListInner = FindingList.WrappedComponent;
  const pid = 3;

  describe('with mock data', () => {
    const mock_finding_data = {
      findings: [
        {
          probability: 0.1,
          font: {
            id: 1, name: 'TEST_FONT1', is_free: true, license_summary: 'TEST_LICENSE',
          },
        },
        {
          probability: 0.1,
          font: {
            id: 2, name: 'TEST_FONT2', is_free: true, license_summary: 'TEST_LICENSE',
          },
        },
        {
          probability: 0.1,
          font: {
            id: 3, name: 'TEST_FONT3', is_free: true, license_summary: 'TEST_LICENSE',
          },
        },
      ],
    };

    const mock_photo_data = {
      photo: {
        memo: 'TEST_MEMO',
        image_url: 'TEST_URL',
        selected_font: {
          name: 'TEST_NAME',
        },
      },
    };

    let comp; let hist; 

    beforeAll(() => {
      hist = { push: jest.fn() };
      comp = shallow(<FindingListInner
        findings={mock_finding_data.findings}
        photo_id={pid}
        history={hist}
      />,
      { disableLifecycleMethods: false });
    });

    it('should display all items', () => {
      const rows = comp.find(FontItem);
      expect(rows.length).toBe(mock_finding_data.findings.length);
    });

    // it('finding button should work', () => {
    //   for (let i = 0; i < 3; ++i) {
    //     const font_id = mock_finding_data.findings[i].font.id;
    //     const row0 = comp.find('tr').at(i);
    //     const btns = row0.find('.font-name');
    //     expect(btns.length).toBe(1);

    //     btns.simulate('click');
    //     expect(hist.push).lastCalledWith(`/font/${font_id}`);
    //   }
    // });
  });
});
