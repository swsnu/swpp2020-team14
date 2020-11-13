import React from 'react';
import { shallow } from 'enzyme';
import ArticleList from '../../article/components/ArticleList';
import PhotoList from '../../photo/components/PhotoList';
import MyPage from './MyPage';

describe("MyPage", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const hist = { push: jest.fn() };
    const comp = shallow(<MyPage.WrappedComponent
        history={ hist } />);
    const article = comp.find(ArticleList);
    expect(article.length).toBe(1); 
	expect(article.prop("fetchEndpoint")).toEqual("/api/my-page/article");
	const photo = comp.find(PhotoList);
    expect(photo.length).toBe(1); 
    expect(photo.prop("fetchEndpoint")).toEqual("/api/my-page/photo");
  })

  it('should have working photo button', () => {
    const hist = { push: jest.fn() };
    const comp = shallow(<MyPage.WrappedComponent
        history={ hist } />);
    comp.find('.photo-button').simulate("click");
    expect(hist.push).toHaveBeenCalledTimes(1);
  })

});