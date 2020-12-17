import React from 'react';
import axios from 'axios';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import ArticleEdit from './ArticleEdit';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('ArticleEdit', () => {
  const shallow = createShallow({ disableLifecycleMethods: false });
  const mount = createMount();

  const ArticleEditInner = ArticleEdit.WrappedComponent;
  const mock_history = { push: jest.fn(), goBack: jest.fn(), replace: jest.fn() };
  const aid = 3;
  const mocked_article = {
    id: aid,
    title: 'title 01',
    author: 'author 01',
    created_at: 'd1',
    last_edited_at: 'd2',
    image_url: 'http://example.com/tmp.png',
    content: 'content',
    is_liked: false,
    like_count: 3,
    is_owner: false,
  };

  afterEach(() => jest.clearAllMocks());

  describe('on new article', () => {
    let comp;
    beforeEach(() => {
      comp = shallow(
        <ArticleEditInner
          originalId={-1}
          history={mock_history}
        />);
    });

    it('should handle title change', async () => {
      const input_title = comp.find('.title');
      expect(input_title.length).toBe(1);
      input_title.simulate('change', { target: { name: 'title', value: 'new title' } });

      const input_content = comp.find('.content');
      expect(input_content.length).toBe(1);
      input_content.simulate('change', { target: { name: 'content', value: 'new content' } });

      while (comp.state().title !== 'new title') await new Promise((r) => setTimeout(r, 100));
      while (comp.state().content !== 'new content') await new Promise((r) => setTimeout(r, 100));
    });

    it('should deny empty title', async () => {
      const form = comp.find('.article-edit form');
      await new Promise((r) => comp.setState({ title: '', content: 'new c' }, r));
      form.simulate('submit', { preventDefault: () => {} });
      while (window.alert.mock.calls.length !== 1) await new Promise((r) => setTimeout(r, 100));
    });

    it('should handle submit', async () => {
      const form = comp.find('.article-edit form');
      comp.instance().imgInput = { current: { files: [''] } };

      axios.post.mockResolvedValueOnce({ data: { success: false, error: 'err' } });
      await new Promise((r) => comp.setState({ title: 'new t', content: 'new c' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));

      axios.post.mockResolvedValueOnce({ data: { success: true, id: 123 } });
      await new Promise((r) => comp.setState({ title: 'new t', content: 'new c' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));
    });
  });

  it('should handle failure loading article', async () => {
    axios.get.mockImplementationOnce((url) => new Promise((recv, rej) => rej()));
    shallow(
      <ArticleEditInner
        originalId={aid}
        history={mock_history}
      />);
    while (mock_history.goBack.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));
  });

  describe('on existing article', () => {
    let comp;
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({ data: { article: mocked_article } });
      comp = shallow(<ArticleEditInner
        originalId={aid}
        history={mock_history}
      />, { disableLifecycleMethods: false });
    });

    it('should handle submit', async () => {
      const form = comp.find('.article-edit form');
      comp.instance().imgInput = { current: { files: [''] } };

      axios.post.mockResolvedValueOnce({ data: { success: false, error: 'err' } });
      await new Promise((r) => comp.setState({ title: 'new t', content: 'new c' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));

      while (window.alert.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));

      axios.put.mockResolvedValueOnce({ data: { success: true, id: aid } });
      await new Promise((r) => comp.setState({ title: 'new t', content: 'new c' }, r))
        .then(() => form.simulate('submit', { preventDefault: () => {} }));

      while (mock_history.goBack.mock.calls.length === 0) await new Promise((r) => setTimeout(r, 100));
    });

    it('should reset photo', () => {
      comp.instance().imgInput = { current: { files: [''] } };
      const btn = comp.find('.btn-reset');
      expect(btn.length).toBe(1);

      btn.simulate('click');
    });
  });
});
