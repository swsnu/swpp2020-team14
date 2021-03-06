import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoDetail from './PhotoDetail';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoDetail', () => {
  const pid = 1;
  const PhotoDetailInner = PhotoDetail.WrappedComponent;
  const mock_history = { push: jest.fn() };
  const mocked_photo = {
    id: pid,
    memo: 'TEST_MEMO',
    image_url: 'TEST_URL',
    selected_font: {
      name: 'TEST_NAME',
    },
  };

  afterEach(() => jest.clearAllMocks());

  it('should display loading message when not loaded', () => {
    const comp = shallow(<PhotoDetailInner photo_id={pid} />);

    const msg = comp.find('.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch photo', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual(`/api/photo/${pid}`);
      rej(); done();
    }));

    shallow(<PhotoDetailInner photo_id={pid} history={mock_history} />,
      { disableLifecycleMethods: false });
  });

  describe('with mock data', () => {
    let comp;
    const loggedIn = { logged_in: true }
    const notLoggedIn = { logged_in: false }

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: { photo: mocked_photo } });  
      comp = shallow(<PhotoDetailInner photo_id={pid} history={mock_history} login={loggedIn}/>,
        { disableLifecycleMethods: false });
      while (comp.find('.loading').length === 1) {
        await new Promise((resv) => setTimeout(resv, 100));
      }
    });

    it('should display all required items', () => {
      expect(comp.find('.memo').length).toBe(1);
    });

    it('should have working update memo button', () => {
      const memo = comp.find('.memo');
      const btn = comp.find('.update-memo-button');
      expect(btn.length).toBe(1);

      axios.patch.mockResolvedValueOnce({ data: { photo: {} } });
      btn.simulate('click');

      memo.simulate('change', { target: { value: 'CHANGED MEMO' } });
      const newInstance = comp.instance();
      expect(newInstance.state.memo).toEqual('CHANGED MEMO');

      axios.patch.mockRejectedValueOnce({ data: { photo: {} } });
      btn.simulate('click');
      expect(axios.patch).toHaveBeenCalled();
    });
  });
});
