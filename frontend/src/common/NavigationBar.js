import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import { updateLogin } from '../sign/actions/actions';

class NavigationBar extends Component {
  onSignout() {
    (async () => {
      await axios.get('/api/token')
      await axios.post('/api/signout')
    })().finally(() => {
      window.localStorage.removeItem("login.logged_in");
      window.localStorage.removeItem("login.user_info");
      this.props.updateLogin({ logged_in: false, user_info: null });
    });
  }


  render() {
    const { logged_in, user_info } = this.props.login;
    return (<div className="navi">
      <img src="" alt="Logo" />
      <Link replace to="/article"><button className="btn btn-article">Articles</button></Link>
      <Link replace to="/my-page"><button className="btn btn-mypage">My Page</button></Link>
      <Link replace to="/font"><button className="btn btn-font">Font</button></Link>
      <div className="greeting">{
        (logged_in) ? (
          <div className="greeting-logged-in">
            <div className="username">Hello, { user_info.nickname }.</div>
            <div><button className="btn-signout" onClick={ () => this.onSignout() }>Sign out</button></div>
          </div>
        ) : (
          <div className="greeting-not-logged-in">
            <div className="msg-signin">Please sign in.</div>
            <span className="btn-signin"><Link to="/signin">Sign in</Link></span>
            &nbsp;/&nbsp;
            <span className="btn-signup"><Link to="/signup">Sign up</Link></span>
          </div>
        )
      }</div>
    </div>);
  }
}

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  updateLogin: (data) => dispatch(updateLogin(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));