import React from 'react';
import { shallow } from 'enzyme';

import PageButtonArray from './pagination.js';

describe('PageButtonArray', () => {
  let comp; let
    onclick;
  beforeAll(() => {
    onclick = jest.fn();
    comp = shallow(<PageButtonArray
      cur={38}
      n={40}
      onclick={onclick}
    />);
  });
  afterEach(() => jest.clearAllMocks());

  it('should display current page button', () => {
    const btns = comp.find('button');
    const cur_page = btns.filterWhere((x) => x.text() === '38');
    expect(cur_page.length).toBe(1);
  });

  it('should display boundary buttons', () => {
    const btns = comp.find('button.page-btn-ends');
    expect(btns.length).toBe(2);
  });

  it('should call callback', async () => {
    const btn = comp.find('button').filterWhere((x) => x.text() === '38');
    btn.simulate('click', { preventDefault: () => {} });
    while (onclick.mock.calls.length === 0) await new Promise((x) => setTimeout(x, 100));
    expect(onclick).toHaveBeenLastCalledWith(38);
  });
});
