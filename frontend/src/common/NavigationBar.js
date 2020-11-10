import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { updateLogin } from '../sign/actions/actions';

class NavigationBar extends Component {
  onSignout() {
    window.localStorage.removeItem("login.logged_in");
    window.localStorage.removeItem("login.user_info");
    this.props.updateLogin({ logged_in: false, user_info: null });
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
            <div className="btn-signout"><button onClick={ this.onSignout.bind(this) }>Sign out</button></div>
          </div>
        ) : (
          <div className="greeting-not-logged-in">
            <div className="plz-sign-in">Please sign in.</div>
            <div className="btn-signin"><Link to="/signin">Sign in</Link></div>
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