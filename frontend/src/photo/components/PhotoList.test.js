import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoList from './PhotoList'

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoList', () => {
  const PhotoListInner = PhotoList.WrappedComponent;
  const mock_history = { push: jest.fn() };
  const mock_endpoint = "/end/point";

  it('should display loading message when not loaded', () => {
    const comp = shallow(<PhotoListInner />);
    const msg = comp.find('.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url.startsWith(mock_endpoint)).toBe(true);
      rej(); done();
    }));

    shallow(<PhotoListInner fetchEndpoint={ mock_endpoint }  />, 
      { disableLifecycleMethods: false });
  })

  describe('with mock data', () => {
    const mocked_data = {
      photos: [
        { id: 1, memo: "TEST_MEMO1", image_url: "TEST_URL1" }, 
        { id: 2, memo: "TEST_MEMO2", image_url: "TEST_URL2" }, 
        { id: 3, memo: "TEST_MEMO3", image_url: "TEST_URL3" }, 
      ]};

    let comp;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data })
      comp = shallow(<PhotoListInner
        fetchEndpoint={ mock_endpoint } history={ mock_history }/>, 
          { disableLifecycleMethods: false });
      while (comp.first().type() === "p") {
        await new Promise(resv => setTimeout(resv, 100));
      }
    })

    it('should display all items', () => {
      const photos = comp.find('.photos .Photo');
      expect(photos.length).toBe(mocked_data.photos.length);
    })

    it('should redirect to detail page', () => {
      const img = comp.find('.photos .Photo img');
      expect(img.length).toBe(3);
      img.at(0).simulate('click')
      expect(mock_history.push).lastCalledWith("/my-page/photo/1")
    })

  })

  describe('PhotoList', () => {
    const PhotoListInner = PhotoList.WrappedComponent;
    const mock_history = { push: jest.fn() };
    const mock_endpoint = "/end/point";
    const mocked_data = {
      photos: [
        { id: 1, memo: "TEST_MEMO1", image_url: "TEST_URL1" }, 
        { id: 2, memo: "TEST_MEMO2", image_url: "TEST_URL2" }, 
        { id: 3, memo: "TEST_MEMO3", image_url: "TEST_URL3" }, 
      ]};

    let comp;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data })
      comp = shallow(<PhotoListInner
        fetchEndpoint={ mock_endpoint } isUploadAvailable={true} 
        isDeleteAvailable ={true} history={ mock_history }/>, 
          { disableLifecycleMethods: false });
      while (comp.first().type() === "p") {
        await new Promise(resv => setTimeout(resv, 100));
      }
    })

    it('should have working upload button', () => {
      
      const btn = comp.find('#upload-button');
      expect(btn.length).toBe(1);

      btn.simulate("click")
			expect(mock_history.push).lastCalledWith(`/photo/create`)
    })

    it('should have working delete button', () => {
      axios.delete.mockImplementationOnce((url) => new Promise((resv, rej) => {
        expect(url.endsWith(1)).toBe(true);
        rej(); done();
      }));

      const btn = comp.find('#delete-button');
      expect(btn.length).toBe(1);
      const newInstance = comp.instance()
      expect(newInstance.state.is_delete_clicked).toEqual(false)

      btn.simulate("click")
      expect(newInstance.state.is_delete_clicked).toEqual(true)
      
      const checkbox = comp.find('.photos .Photo #delete-checkbox');
      checkbox.at(0).simulate("click")

      btn.simulate("click")
    })

  })

})