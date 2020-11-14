import React from 'react';
import { shallow } from 'enzyme';
import MyPage from '../components/MyPage';
import mypage from './mypage';

describe("MypageView", () => {
  afterEach(() => jest.clearAllMocks());

  it('should call component properly', () => {
    const comp = shallow(<mypage.WrappedComponent />);
    const mp = comp.find(MyPage);
    expect(mp.length).toBe(1); 
  })
});