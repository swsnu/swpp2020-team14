import React from 'react';
import axios from 'axios';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import ArticleList from './ArticleList';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('ArticleList', () => {
  const ArticleListInner = ArticleList.WrappedComponent;
  const mock_endpoint = '/end/point';
  const shallow = createShallow({ disableLifecycleMethods: false });
  const mount = createMount();

  it('should display loading message when not loaded', () => {
    const comp = shallow(<ArticleListInner />, { disableLifecycleMethods: true });
    const msg = comp.find('p.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url.startsWith(mock_endpoint)).toBe(true);
      rej(); done();
    }));

    shallow(<ArticleListInner fetchEndpoint={mock_endpoint} />);
  });

  describe('with mock data', () => {
    const mocked_data = {
      pages: 50,
      cur: 38,
      list: [
        {
          id: 3,
          title: 'title 01',
          author: 'author 01',
          comment_count: 3,
        },
        {
          id: 5,
          title: 'title 02',
          author: 'author 02',
          comment_count: 0,
        },
        {
          id: 9,
          title: 'title 03',
          author: 'author 03',
          comment_count: 1,
        },
      ],
    };

    let comp, hist, items;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data });
      hist = { push: jest.fn() };
      comp = shallow(<ArticleListInner
        fetchEndpoint={mock_endpoint}
        history={hist}
      />);
      // wait for the axios & re-render() jobs to finish,
      //   by flushing Promise chain; cf.
      //   GitHub: facebook/jest#2157
      await new Promise((resolve) => window.setImmediate(resolve));
      items = comp.find('.row');
    });

    it('should display all items', () => {
      expect(items.length).toBe(mocked_data.list.length);
    });

    it('should display comment numbers', () => {
      const titles = items.map(
        x => x.find('.td.title').childAt(0)
      ).map(
        x => mount(x.prop('primary')).text()
      );
      // first item has 3 comments
      expect(titles[0]).toEqual(expect.stringContaining('[3]'));

      // second item has no comments
      expect(titles[1]).toEqual(expect.not.stringContaining('[0]'));
    });

    it('should display page buttons', () => {
      const arr = comp.find('PageButtonArray');
      expect(arr.length).toBe(1);
      expect(arr.prop('n')).toBe(mocked_data.pages);
      expect(arr.prop('cur')).toBe(mocked_data.cur);
    });

    it('page buttons should attempt to fetch', (done) => {
      const arr = comp.find('PageButtonArray');
      const browser = arr.prop('onclick');
      axios.get.mockImplementationOnce(async (url) => {
        expect(url).toEqual(`${mock_endpoint}?page=17`);
        done();
      });
      browser(17);
    });
  });
});
