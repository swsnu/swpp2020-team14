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
  })
});