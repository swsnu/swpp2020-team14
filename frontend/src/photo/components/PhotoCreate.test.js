import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoCreate from './PhotoCreate';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('PhotoCreate', () => {
  const PhotoEditInner = PhotoCreate.WrappedComponent;
  const mock_history = { push: jest.fn(), goBack: jest.fn(), replace: jest.fn() };
  const pid = 3;
  const mocked_photo = {
    id: pid,
    image_url: 'TEST_URL',
    selected_font: {
      name: 'TEST_NAME',
    },
  };
  let comp;
  global.URL.createObjectURL = jest.fn();

  afterEach(() => jest.clearAllMocks());

  beforeEach(() => {
    comp = shallow(<PhotoEditInner
      history={mock_history}
    />, { disableLifecycleMethods: false });
  });

  it('should handle submit', async () => {
    const form = comp.find('.photo-create form');
    comp.instance().imgInput = { current: { files: [''] } };

    axios.post.mockResolvedValueOnce({ data: { success: false, error: 'err' } });
    await new Promise((r) => comp.setState({ chosen_file: "/test/test" }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));
    while (window.alert.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));

    axios.post.mockResolvedValueOnce({ data: { success: true, id: 123 } });
    await new Promise((r) => comp.setState({ chosen_file: "/test/test" }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));
    while (mock_history.push.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));

  });

  it('should handle submit with no photo', async () => {
    const form = comp.find('.photo-create form');
    comp.instance().imgInput = { current: { files: [''] } };

    axios.post.mockResolvedValueOnce({ data: { success: false, error: 'err' } });
    await new Promise((r) => comp.setState({ chosen_file: null }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));
    while (window.alert.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));
  });

  it('should reset photo', () => {
    comp.instance().imgInput = { current: { files: [''] } };
    const btn = comp.find('.btn-reset');
    expect(btn.length).toBe(1);

    btn.simulate('click');
  });
});
