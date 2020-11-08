import React from 'react';
import { shallow } from 'enzyme';

import CommentList from './CommentList';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('CommentList', () => {
  const mocked_comments = [
    {id: 3, author: "author 01", created_at: "d1", last_edited_at: "d2",
      is_owner: false, content: "content 01"},
    {id: 5, author: "author 02", created_at: "d3", last_edited_at: "d4",
      is_owner: true, content: "content 02"},
    {id: 9, author: "author 03", created_at: "d5", last_edited_at: "d6",
      is_owner: false, content: "content 03"},
  ];

  let comp, onDelete, onSubmit;
  beforeAll(() => {
    onDelete = jest.fn();
    onSubmit = jest.fn();
    comp = shallow(<CommentList comments={ mocked_comments }
      onDelete={ onDelete } onSubmit={ onSubmit }/>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display all items', () => {
    const rows = comp.find('.cmt-itm');
    expect(rows.length).toBe(mocked_comments.length);
  });

  it('should higlight on edit', () => {
    const btns = comp.find('.cmt-itm .btns button');
    expect(btns.length).toBe(2); // since only 1 comment is owned
    btns.at(0).simulate("click");

    const rows = comp.find('.cmt-itm');
    expect(rows.at(1).hasClass("edit")).toBe(true);
  });

  it('should call delete', async () => {
    const btns = comp.find('.cmt-itm .btns button');
    expect(btns.length).toBe(2); // since only 1 comment is owned
    btns.at(1).simulate("click");

    await new Promise(r=>setTimeout(r, 100));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
