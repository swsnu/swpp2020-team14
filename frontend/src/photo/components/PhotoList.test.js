import React from 'react';
import axios from 'axios';
import { shallow, mount, render } from 'enzyme';

import PhotoList from './PhotoList';


jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoList', () => {
  // let shallow;
  const PhotoListInner = PhotoList.WrappedComponent;
  const mock_history = { push: jest.fn() };

  it('should display loading message when not loaded', () => {
    // shallow = createShallow();
    const comp = shallow(<PhotoListInner />);
    const msg = comp.find('.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url.startsWith(`/api/my-page/photo`)).toBe(true);
      rej(); done();
    }));

    shallow(<PhotoListInner  />,
      { disableLifecycleMethods: false });
  });

  it('should attempt to fetch with trunc', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url.endsWith(`trunc=6`)).toBe(true);
      rej(); done();
    }));

    shallow(<PhotoListInner trunc={6}/>,
      { disableLifecycleMethods: false });
  });

  describe('with mock data', () => {
    const mocked_data = {
      photos: [
        { id: 1, memo: 'TEST_MEMO1', image_url: 'TEST_URL1' },
        { id: 2, memo: 'TEST_MEMO2', image_url: 'TEST_URL2' },
        { id: 3, memo: 'TEST_MEMO3', image_url: 'TEST_URL3' },
      ],
    };

    let comp;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data });
      comp = shallow(<PhotoListInner
        history={mock_history}
      />,
      { disableLifecycleMethods: false });
      while (comp.first().type() === 'p') {
        await new Promise((resv) => setTimeout(resv, 100));
      }
    });

    it('should display all items', () => {
      const photos = comp.find('.tile-wrapper .tile-img');
      expect(photos.length).toBe(mocked_data.photos.length);
    });

    it('should redirect to detail page', () => {
      const img = comp.find('.tile-wrapper .tile-img');
      expect(img.length).toBe(3);
      img.at(0).simulate('click');
      expect(mock_history.push).lastCalledWith('/photo/1');
    });
  });

  describe('PhotoList', () => {
    const PhotoListInner = PhotoList.WrappedComponent;
    const mock_history = { push: jest.fn() };
    const mock_endpoint = '/end/point';
    const mocked_data = {
      photos: [
        { id: 1, memo: 'TEST_MEMO1', image_url: 'TEST_URL1' },
        { id: 2, memo: 'TEST_MEMO2', image_url: 'TEST_URL2' },
        { id: 3, memo: 'TEST_MEMO3', image_url: 'TEST_URL3' },
      ],
    };

    let comp;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data });
      
      comp = shallow(<PhotoListInner
        fetchEndpoint={mock_endpoint}
        isUploadAvailable
        isDeleteAvailable
        history={mock_history}
      />,
      { disableLifecycleMethods: false });
      
      while (comp.find(".loading").length) {
        await new Promise((resv) => setTimeout(resv, 100));
      }
    });

    it('should have working upload button', () => {
      const btn = comp.find('#upload-button');
      expect(btn.length).toBe(1);

      btn.simulate('click');
      expect(mock_history.push).lastCalledWith('/photo/create');
    });

    it('should have working delete button', (done) => {
      axios.delete.mockImplementationOnce((url) => new Promise((resv, rej) => {
        expect(url.endsWith(1)).toBe(true);
        rej(); done();
      }));

      const btn = comp.find('#delete-button');
      expect(btn.length).toBe(1);
      const newInstance = comp.instance();
      expect(newInstance.state.is_delete_clicked).toBe(false);

      btn.simulate('click');
      expect(newInstance.state.is_delete_clicked).toBe(true);

      const wrapper = comp.find('.tile-wrapper');
      const checkbox = wrapper.at(0).find('#delete-checkbox');
      checkbox.simulate('click');
      
      // const checkbox = comp.find('#delete-checkbox');
      // checkbox.at(0).simulate('click');

      btn.simulate('click');

    });
  });
});
