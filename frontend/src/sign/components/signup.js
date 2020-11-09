import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import axios from 'axios';

import './signup.css';

// Here, we use 'sign' as a key to our combineReducers
class Signup extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      nickname: ""
    };
    this.onEmailInputChanged = this.onEmailInputChanged.bind(this);
    this.onPasswordInputChanged = this.onPasswordInputChanged.bind(this);
    this.onNicknameInputChanged = this.onNicknameInputChanged.bind(this);
    this.onSigninClicked = this.onSigninClicked.bind(this);
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

  // Set nickname state as input
  onNicknameInputChanged(){
    return ( (e) =>
      this.setState({nickname: e.target.value})
    );
  }

  // Send email/password/nickname to the server
  onSigninClicked(){
    axios.post(`/api/signup`, this.state)
    .then(function (resp){
      alert("Now, sign in with your account");
      return(<Redirect exact from='/signup' to='/signin'/>);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
      this.history.goBack();
    });
  }

  componentDidMount() {
    this.onInit();
  }

  render(){
    return(
      <div className="Sign Up Page">
        <div className="email">
          email <input type="text"  onChange={this.onEmailInputChanged} />
        </div>
        <div className="PW">
          PW <input type="password" onChange={this.onPasswordInputChanged} />
        </div>
        <div className="Nickname">
          Nickname <input type="text"  onChange={this.onNicknameInputChanged} />
        </div>
        <div className="Sign Up Button">
          <button onClick={this.onSigninClicked}>Sign Up</button>
        </div>
      </div>
    );
  }
};

export default withRouter(Signup);