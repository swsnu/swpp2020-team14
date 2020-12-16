import React, { Component } from 'react';
import axios from 'axios';
import { Button, TextField, FormHelperText } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { connect } from 'react-redux';
import { updateLogin } from '../actions/actions';

import './signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      nickname: '',
      errorMessage: null,
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    (async () => {
      await axios.get('/api/token');
      await axios.post('/api/signup', {
        email: this.state.email,
        password: this.state.password,
        nickname: this.state.nickname,
      });
      alert('Signup success.');
      this.props.updateLogin({
        logged_in: true,
        user_info: {
          email: this.state.email,
          nickname: this.state.nickname
        },
      });
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
      <div className="signup">
        <form onSubmit={this.onSubmit.bind(this)}>
          <TextField margin="normal" variant="filled" type="email" required fullWidth
            label="Email" name="email" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
          <TextField margin="normal" variant="filled" type="password" required fullWidth
            label="Password" name="password" value={ this.state.password } onChange={ this.handleChange.bind(this) } />
          <TextField margin="normal" variant="filled" type="nickname" required fullWidth
            label="Nickname" name="nickname" value={ this.state.nickname } onChange={ this.handleChange.bind(this) } />
          <div className="row-submit">
            <Button color="primary" fullWidth variant="contained" type="submit">Sign up</Button>
          </div>
          {this.state.errorMessage !== null
          && (
          <div className="row-error-message">
            {this.state.errorMessage !== null &&
              <div className="row row-error-message">
                <ErrorIcon />&nbsp;<span>{ this.state.errorMessage }</span>
              </div>}
          </div>
          )}
          
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  updateLogin: (data) => dispatch(updateLogin(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
