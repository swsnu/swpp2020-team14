import React, { Component } from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';

import {logInSuccess, logOutSuccess} from '../actions/logIn';

import './signin.css';

// Here, we use 'sign' as a key to our combineReducers
class Signin extends Component{
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
        })
        .catch((err) => {
          console.log(err);
          alert(err);
          this.history.goBack();
        });
    }    
    // Log out, which may be used in other pages(Here, this function is useless)
    onSignoutClicked(){
        this.props.logOutSuccess();
        return ( (e) =>
            this.setState({
                email: "", 
                password: ""
            })
        );
    }

    componentDidMount() {
        this.onInit();
    }

    render(){

        return(
            <div className="Sign In Page">
                <div className="email">
                    email <input type="text" onChange={this.onEmailInputChanged} />
                </div>
                <div className="PW">
                    PW <input type="password" onChange={this.onPasswordInputChanged} />
                </div>
                <div className="Sign In Button">
                    <button onClick={this.onSigninClicked}>Sign In</button>
                </div>
                <div className="Sign Out Button">
                    <button onClick={this.onSignoutClicked}>Sign Out</button>
                </div>
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