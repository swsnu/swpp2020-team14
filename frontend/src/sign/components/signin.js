import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { logInSuccess, logOutSuccess } from '../actions/logIn';

import './signin.css';

class Signin extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.onEmailInputChanged = this.onEmailInputChanged.bind(this);
    this.onPasswordInputChanged = this.onPasswordInputChanged.bind(this);
    this.onSigninClicked = this.onSigninClicked.bind(this);
    this.onSignoutClicked = this.onSignoutClicked.bind(this);
  }

  // Redirect to my-page if user is already logged in
  onInit() {
    if(window.sessionStorage.getItem('preserve_login')===true){
      this.props.logInSuccess();
    }
    if(this.props.isLoggedIn === true){
      return (<Redirect exact from='/signin' to='/my-page' />);
    }
  }

  // Set email state as input
  onEmailInputChanged(){
    return ( (e) =>
      this.setState({email: e.target.value})
    );
  }

  // Set password state as input
  onPasswordInputChanged(){
    return ( (e) =>
      this.setState({password: e.target.value})
    );
  }
  // Send email/password to the server
  onSigninClicked(){
    axios.post(`/api/signin`, this.state)
    .then((resp) => {
      this.props.logInSuccess();
      window.sessionStorage.setItem('user_ptr', resp.user_ptr);
      window.sessionStorage.setItem('email', this.state.email);
      window.sessionStorage.setItem('nickname', resp.nickname);
      window.sessionStorage.setItem('preserve_login', true);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
      this.history.goBack();
    });
  }

  // Log out, which may be used in other pages
  onSignoutClicked(){
    axios.post('/api/signout', this.state)
    .then((resp) => {
      this.props.logOutSuccess();
      window.sessionStorage.clear();
      return ( (e) =>
        this.setState({
          email: "",
          password: ""
        })
      );
    })
    .catch((err) => {
      console.log(err);
      alert(err);
      this.history.goBack();
    })
  }

  componentDidMount() {
    this.onInit();
  }

  render(){
    return(
      <div className="Sign In Page">
        { (function(){
          if(this.props.isLoggedIn === true){
            return(
              <div className="Sign Out Button">
              <button onClick={this.onSignoutClicked}>Sign Out</button>
              </div>
            );
          }
          else{
            return(
              <div>
                <div className="email">
                  email <input type="text" onChange={this.onEmailInputChanged} />
                </div>
                <div className="PW">
                  PW <input type="password" onChange={this.onPasswordInputChanged} />
                </div>
                <div className="Sign In Button">
                  <button onClick={this.onSigninClicked}>Sign In</button>
                </div>
              </div>
            );
          }
          })()
        }
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    isLoggedIn: state.sign.isLoggedIn
  };
}

function mapDispatchToProps(dispatch){
  return {
    logInSuccess(){
      dispatch(logInSuccess());
    },
    logOutSuccess(){
      dispatch(logOutSuccess());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signin));