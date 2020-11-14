import React from 'react';
import { shallow } from 'enzyme';
import ArticleDetail from '../components/ArticleDetail';
import ArticleDetailView from './ArticleDetailView';

describe("ArticleDetailView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<ArticleDetailView.WrappedComponent
        history={ hist } match={{ params: { article_id: 3 }}}/>);
    const detail = comp.find(ArticleDetail);
    expect(detail.length).toBe(1); // since only 1 comment is owned
    expect(detail.prop("article_id")).toEqual(3);
  })

  it('should call goBack properly', () => {
    const hist = { goBack: jest.fn() };
    const comp = shallow(<ArticleDetailView.WrappedComponent
        history={ hist } match={{ params: { article_id: 3 }}}/>);
    comp.find('.back').simulate("click");
    expect(hist.goBack).toHaveBeenCalledTimes(1);
  })

});