import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

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
      alert('Signup success.\nNow please login.');
      this.props.history.replace('/signin');
    })().catch((err) => this.setState({ errorMessage: err.message }));
  }

  render() {
    return (
      <div className="signup">
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="row-email">
            <span className="hint hint-email">Email</span>
            <input type="email" name="email" onChange={this.handleChange.bind(this)} />
          </div>
          <div className="row-password">
            <span className="hint hint-password">Password</span>
            <input type="password" name="password" onChange={this.handleChange.bind(this)} />
          </div>
          <div className="row-nickname">
            <span className="hint hint-nickname">Nickname</span>
            <input type="text" name="nickname" onChange={this.handleChange.bind(this)} />
          </div>
          {this.state.errorMessage !== null
          && (
          <div className="row-error-message">
            <span className="icon">⚠&nbsp;</span>
            <span className="error-message">{ this.state.errorMessage }</span>
          </div>
          )}
          <div className="row-submit">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
