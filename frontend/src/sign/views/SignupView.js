import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Signup from '../components/signup';

class SignupView extends Component {
  render() {
    return <Signup />;
  }
}

export default withRouter(SignupView);
