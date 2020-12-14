import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import FindingList from './FindingList';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('FindingList', () => {
  const FindingListInner = FindingList.WrappedComponent;
  const pid = 3;

  it('should display loading message when not loaded', () => {
    // Since disableLifecycleMethods: true (globally),
    //   axios.get() will not be called, and
    //   the component will show loading message.
    const comp = shallow(<FindingListInner />);
    const msg = comp.find('p.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch findings', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual(`/api/photo/${pid}/report`);
      rej(); done();
    })).mockResolvedValueOnce({ data: { photo: {} } });

    shallow(<FindingListInner photo_id={pid} />,
      { disableLifecycleMethods: false });
  });

  it('should attempt to fetch photo', (done) => {
    axios.get.mockResolvedValueOnce({ data: { findings: {} } })
      .mockImplementationOnce((url) => new Promise((resv, rej) => {
        expect(url).toEqual(`/api/photo/${pid}`);
        rej(); done();
      }));

    shallow(<FindingListInner photo_id={pid} />,
      { disableLifecycleMethods: false });
  });

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

    let comp; let hist; let
      tbody;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mock_finding_data })
        .mockResolvedValueOnce({ data: mock_photo_data });
      hist = { push: jest.fn() };
      comp = shallow(<FindingListInner
        photo_id={pid}
        history={hist}
      />,
      { disableLifecycleMethods: false });
      // wait for the axios & re-render() jobs to finish,
      //   by flushing Promise chain; cf.
      //   GitHub: facebook/jest#2157
      await new Promise((resolve) => window.setImmediate(resolve));
      tbody = comp.find('table.font-list-table tbody');
    });

    it('should display all items', () => {
      const rows = tbody.find('tr');
      expect(rows.length).toBe(mock_finding_data.findings.length);
    });

    it('finding button should work', () => {
      for (let i = 0; i < 3; ++i) {
        const font_id = mock_finding_data.findings[i].font.id;
        const row0 = tbody.find('tr').at(i);
        const btns = row0.find('.font-name');
        expect(btns.length).toBe(1);

        btns.simulate('click');
        expect(hist.push).lastCalledWith(`/font/${font_id}`);
      }
    });

    it('should have working radio button', () => {
      axios.patch.mockResolvedValueOnce({ data: {} });
      const row0 = tbody.find('tr').at(0);
      const btns = row0.find('.is-selected input');
      expect(btns.length).toBe(1);

      btns.simulate('click');

      setTimeout(() => {
        const { selected_font } = comp.instance().state;
        expect(selected_font).toEqual(mock_finding_data.findings[0].font.id);
      }, 2000);
    });
  });
});
