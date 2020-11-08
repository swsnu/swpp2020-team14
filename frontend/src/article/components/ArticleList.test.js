import axios from 'axios';
import { shallow } from 'enzyme';

import ArticleList from './ArticleList';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('ArticleList', () => {
  const ArticleListInner = ArticleList.WrappedComponent;
  const mock_endpoint = "/end/point";

  it('should display loading message when not loaded', () => {
    // Since disableLifecycleMethods: true (globally),
    //   axios.get() will not be called, and
    //   the component will show loading message.
    const comp = shallow(<ArticleListInner />);
    const msg = comp.find('p.loading');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url.startsWith(mock_endpoint)).toBe(true);
      rej(); done();
    }));

    const comp = shallow(<ArticleListInner fetchEndpoint={ mock_endpoint } />,
      { disableLifecycleMethods: false });
  });

  describe('with mock data', () => {
    const mocked_data = {
        pages: 50, cur: 38, list: [
          {id: 3, title: "title 01", author: "author 01",
            comment_count: 3},
          {id: 5, title: "title 02", author: "author 02",
            comment_count: 0},
          {id: 9, title: "title 03", author: "author 03",
            comment_count: 1},
        ]};

    let comp, hist, tbody;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: mocked_data });
      hist = { push: jest.fn() };
      comp = shallow(<ArticleListInner
        fetchEndpoint={ mock_endpoint } history={ hist }/>, 
          { disableLifecycleMethods: false });
      // wait for the axios & re-render() jobs to finish,
      //   by flushing Promise chain; cf.
      //   GitHub: facebook/jest#2157
      await new Promise(resolve => setImmediate(resolve));
      tbody = comp.find('table.article-list-table tbody');
    });

    it('should display all items', () => {
      const rows = tbody.find('tr');
      expect(rows.length).toBe(mocked_data.list.length);
    });

    it('title button should work', () => {
      for (let i = 0; i < 3; ++i) {
        const a_id = mocked_data.list[i].id;
        const row0 = tbody.find('tr').at(i);
        const btns = row0.find('button');
        expect(btns.length).toBe(1);

        btns.simulate('click');
        expect(hist.push).lastCalledWith(`/article/${a_id}`);
      }
    });

    it('should display comment numbers', () => {
      const titles = tbody.find('tr .title button');
      // first item has 3 comments
      expect(titles.at(0).text()).toEqual(expect.stringContaining("[3]"));

      // second item has no comments
      expect(titles.at(1).text()).toEqual(expect.not.stringContaining("[0]"));
    });

    it('should display page buttons', () => {
      const arr = comp.find('PageButtonArray');
      expect(arr.length).toBe(1);
      expect(arr.prop("n")).toBe(mocked_data.pages);
      expect(arr.prop("cur")).toBe(mocked_data.cur);
    });

    it('page buttons should attempt to fetch', (done) => {
      const arr = comp.find('PageButtonArray');
      const browser = arr.prop("onclick");
      axios.get.mockImplementationOnce(async (url) => {
        expect(url).toEqual(`${mock_endpoint}?page=17`);
        done();
      });
      browser(17);
    });
  });
});
