import React from 'react';
import { shallow } from 'enzyme';

import CommentList from './CommentList';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('CommentList', () => {
  const mocked_comments = [
    {
      id: 3,
      author: 'author 01',
      created_at: '2020/12/15 12:01:01',
      last_edited_at: '2020/12/15 12:01:01',
      is_owner: false,
      content: 'content 01',
    },
    {
      id: 5,
      author: 'author 02',
      created_at: 'd3',
      last_edited_at: 'd4',
      is_owner: true,
      content: 'content 02',
    },
    {
      id: 9,
      author: 'author 03',
      created_at: 'd5',
      last_edited_at: 'd6',
      is_owner: false,
      content: 'content 03',
    },
  ];

  let comp; let onDelete; let
    onSubmit;
  beforeAll(() => {
    onDelete = jest.fn();
    onSubmit = jest.fn();
    comp = shallow(<CommentList
      comments={mocked_comments}
      onDelete={onDelete}
      onSubmit={onSubmit}
    />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display all items', () => {
    const rows = comp.find('.cmt-itm');
    expect(rows.length).toBe(mocked_comments.length);
  });

  it('should create comment', async () => {
    const createInput = comp.find('.new-comment .comment-input')
    const submitBtns = comp.find('.new-comment .submit-button')
    expect(createInput.length).toBe(1);
    expect(submitBtns.length).toBe(1);

    createInput.simulate('change', {target: {value: "changed"}});
    expect(comp.state().comment_body).toEqual('changed');
    expect(comp.state().edit_target).toEqual(-1);
    submitBtns.simulate('click');

    await new Promise((r) => setTimeout(r, 100));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  })

  it('should call delete', async () => {
    const btns = comp.find('.cmt-itm .btns .delete-button');
    expect(btns.length).toBe(1); // since only 1 comment is owned
    btns.simulate('click');

    await new Promise((r) => setTimeout(r, 100));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should higlight on edit', () => {
    const editBtns = comp.find('.cmt-itm .btns .edit-button');
    expect(editBtns.length).toBe(1); // since only 1 comment is owned
    editBtns.simulate('click');
    editBtns.simulate('click');
    expect(comp.state().edit_target).toEqual(-1);
    editBtns.simulate('click');
    expect(comp.state().edit_target).toEqual(5);
  });

  it('should edit comment', async () => {
    const editInput = comp.find('.cmt-itm .edit-comment .comment-edit-input')
    const submitBtns = comp.find('.cmt-itm .edit-comment .submit-button')
    expect(editInput.length).toBe(1);
    expect(submitBtns.length).toBe(1);

    editInput.simulate('change', {target: {value: "changed"}});
    expect(comp.state().comment_body).toEqual('changed');
    expect(comp.state().edit_target).toEqual(5);
    submitBtns.simulate('click');

    await new Promise((r) => setTimeout(r, 100));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  })

  it('should show datetime', () => {
    const create = comp.find('.create');
    expect(create.length).toBe(3);
    expect(create.at(0).text()).toEqual("Created at 20/12/15 12:01")
  })
});
