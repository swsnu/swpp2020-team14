import React from 'react';
import { shallow } from 'enzyme';
import ArticleEdit from '../components/ArticleEdit';
import ArticleCreateView from './ArticleCreateView';

describe('ArticleDetailView', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<ArticleCreateView.WrappedComponent />);
    const edit = comp.find(ArticleEdit);
    expect(edit.length).toBe(1);
  });
});
