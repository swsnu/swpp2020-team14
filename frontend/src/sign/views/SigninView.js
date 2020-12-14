import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Signin from '../components/signin';

import { updateLogin } from '../actions/actions';

class SigninView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
    };
  }

  loginAttempt(data) {
    if (!data.email || !data.password) {
      this.setState({ errorMessage: 'Email or password cannot be empty' });
      return;
    }

    (async () => {
      await axios.get('/api/token');
      const resp = await axios.post('/api/signin', data);
      this.props.updateLogin({
        logged_in: true,
        user_info: resp.data,
      });
      window.localStorage.setItem('login.logged_in', '');
      window.localStorage.setItem('login.user_info', JSON.stringify(resp.data));
    })().catch((err) => {
      if (err.response) {
        this.setState({ errorMessage: err.response.data });
      } else {
        this.setState({ errorMessage: err.message });
      }
    });
  }

  render() {
    return (
      <Signin
        loginAttempt={this.loginAttempt.bind(this)}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  updateLogin: (data) => dispatch(updateLogin(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SigninView);
