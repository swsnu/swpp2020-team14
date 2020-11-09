import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Signin from '../components/signin';

class SigninView extends Component {
  render() {
    return <Signin />;
  }
}

export default withRouter(SigninView);