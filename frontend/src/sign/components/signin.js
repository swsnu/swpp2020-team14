import React, { Component } from 'react';

import './signin.css';

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange(e){
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(event){
    event.preventDefault();
    
    this.props.loginAttempt({
      email: this.state.email,
      password: this.state.password
    });
  }

  render(){
    return(
      <div className="signin">
        <form onSubmit={ this.onSubmit.bind(this) }>
          <div className="row-email">
            <span className="hint-email">Email</span>
            <input type="email" name="email" onChange={ this.handleChange.bind(this) } />
          </div>
          <div className="row-password">
            <span className="hint-password">Password</span>
            <input type="password" name="password" onChange={ this.handleChange.bind(this) } />
          </div>
          {this.props.errorMessage !== null &&
          <div className="row-error-message">
            <span className="icon">⚠&nbsp;</span>
            <span className="error-message">{ this.props.errorMessage }</span>
          </div>}
          <div className="row-submit">
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Signin;