import React from 'react';
import { shallow } from 'enzyme';
import ArticleList from '../components/ArticleList';
import ArticleListView from './ArticleListView';

describe("ArticleListView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<ArticleListView.WrappedComponent history={ hist } />);
    const detail = comp.find(ArticleList);
    expect(detail.length).toBe(1);
    expect(detail.prop("fetchEndpoint")).toEqual("/api/article");
  });

  it('should have a working Create button', async () => {
    const hist = { push: jest.fn() };
    const comp = shallow(<ArticleListView.WrappedComponent history={ hist } />);
    const btn = comp.find('button');
    expect(btn.length).toBe(1);
    btn.simulate('click');
    while (hist.push.mock.calls.length === 0)
      await new Promise(r => setTimeout(r, 100));
    expect(hist.push).toHaveBeenLastCalledWith('/article/create');
  });


});