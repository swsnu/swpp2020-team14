import React from 'react';
import { shallow } from 'enzyme';
import ArticleEdit from '../components/ArticleEdit';
import ArticleEditView from './ArticleEditView';

describe("ArticleEditView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
	const comp = shallow(<ArticleEditView.WrappedComponent match={{ params: { article_id: 3 }}} />);
    const edit = comp.find(ArticleEdit);
    expect(edit.length).toBe(1); 
  })
});