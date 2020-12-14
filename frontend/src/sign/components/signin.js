import React, { Component } from 'react';
import { Button, TextField, FormHelperText } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

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
          <TextField margin="normal" variant="filled" type="email" required fullWidth
            label="Email" name="email" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
          <TextField margin="normal" variant="filled" type="password" required fullWidth
            label="Password" name="password" value={ this.state.password } onChange={ this.handleChange.bind(this) } />
          <div className="row row-btn-signin">
            <Button color="primary" fullWidth variant="contained" onClick={(e)=>{ this.onSubmit(e); }}>Sign In</Button>
          </div>
          {this.props.errorMessage !== null &&
          <div className="row row-error-message">
            <ErrorIcon />&nbsp;<span>{ this.props.errorMessage }</span>
          </div>}
        </form>
      </div>
    );
  }
}

export default Signin;
