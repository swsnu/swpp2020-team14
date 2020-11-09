import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import MyPage from '../components/MyPage';

class MyPageView extends Component {
  render() {
    return (
      <div className="my-page">
        <MyPage />
      </div>
    )
  }
};
export default withRouter(MyPageView);
