import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoEdit from './PhotoEdit';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoEdit', () => {
  const PhotoEditInner = PhotoEdit.WrappedComponent;
  const mock_history = { push: jest.fn(), goBack: jest.fn(), replace: jest.fn() };
  const pid = 3;
  const mocked_photo = {
    id: pid,
    memo: 'TEST_MEMO',
    image_url: 'TEST_URL',
    selected_font: {
      name: 'TEST_NAME',
    },
  };

  afterEach(() => jest.clearAllMocks());

  describe('on new photo', () => {
    let comp;
    beforeEach(() => {
      comp = shallow(<PhotoEditInner
        originalId={-1}
        history={mock_history}
      />, { disableLifecycleMethods: false });
    });

    it('should handle submit', async () => {
      const form = comp.find('.photo-edit form');
      comp.instance().imgInput = { current: { files: [''] } };

      axios.post.mockResolvedValueOnce({ data: { success: false, error: 'err' } });
      await new Promise((r) => comp.setState({ memo: 'TEST_MEMO' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));

      axios.post.mockResolvedValueOnce({ data: { success: true, id: 123 } });
      await new Promise((r) => comp.setState({ memo: 'TEST_MEMO' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));
    });

    it('should deny empty memo', async () => {
      const form = comp.find('.photo-edit form');
      await new Promise((r) => comp.setState({ memo: '' }, r));
      form.simulate('submit', { preventDefault: () => {} });
      while (window.alert.mock.calls.length !== 1) await new Promise((r) => setTimeout(r, 100));
    });
  });

  it('should handle failure loading photo', async () => {
    axios.get.mockImplementationOnce((url) => new Promise((recv, rej) => rej()));
    shallow(<PhotoEditInner
      originalId={pid}
      history={mock_history}
    />, { disableLifecycleMethods: false });
    while (mock_history.goBack.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));
  });

  describe('on existing photo', () => {
    let comp;
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({ data: { photo: mocked_photo } });
      comp = shallow(<PhotoEditInner
        originalId={pid}
        history={mock_history}
      />, { disableLifecycleMethods: false });
    });

    it('should handle submit', async () => {
      const form = comp.find('.photo-edit form');
      comp.instance().imgInput = { current: { files: [''] } };

      axios.put.mockResolvedValueOnce({ data: { success: true, id: pid } });
      await new Promise((r) => comp.setState({ memo: 'TEST_MEMO' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));

      while (mock_history.goBack.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));
    });
  });
});
