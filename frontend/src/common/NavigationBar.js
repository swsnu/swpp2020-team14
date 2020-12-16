import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { updateLogin } from '../sign/actions/actions';

import './NavigationBar.css';

class NavigationBar extends Component {
  constructor () {
    super();
    this.state = {
      profileOpen: false,
      menuOpen: false
    };
    this.profileAnchorRef = React.createRef();
    this.menuAnchorRef = React.createRef();
  }

  onSignout() {
    (async () => {
      await axios.get('/api/token')
      await axios.post('/api/signout')
    })().finally(() => {
      window.localStorage.removeItem("login.logged_in");
      window.localStorage.removeItem("login.user_info");
      this.props.updateLogin({ logged_in: false, user_info: null });
      this.props.history.replace('/')
    });
  }

  onProfileOpen() { this.setState({ profileOpen: !this.state.profileOpen }); }
  onProfileClose() { this.setState({ profileOpen: false }); }

  render() {
    const { logged_in, user_info } = this.props.login;
    let profile_area = null;

    if (logged_in) {
      profile_area = (<div className="profile-auth">
        <Typography component="span" ><b>{ user_info.nickname }</b></Typography>
        <IconButton ref={ this.profileAnchorRef } onClick={ () => this.onProfileOpen() }><AccountCircleIcon /></IconButton>
        <Menu keepMounted
          anchorEl={ this.state.profileOpen ? this.profileAnchorRef.current : null }
          open={ this.state.profileOpen }
          onClose={ this.onProfileClose.bind(this) }>
          <MenuItem onClick={ ()=>{ this.onProfileClose(); this.onSignout(); } }>Sign out</MenuItem>
        </Menu>
      </div>);
    } else {
      profile_area = (<div className="profile-unauth">
        <Button color="inherit" onClick={ ()=>this.props.history.push('/signin') }>Sign in</Button>
        <Typography component="span">&middot;</Typography>
        <Button color="inherit" onClick={ ()=>this.props.history.push('/signup') }>Sign up</Button>
      </div>)
    }

    const current_page_name = this.props.history.location.pathname.split('/')[1];
    const current_tab_idx = ['photo', 'article', 'font', 'my-page'].indexOf(current_page_name);

    return (<AppBar className="navbar" position="static">
      <Toolbar variant="dense">
        <div className="logo">
          <Typography variant="h5" onClick={ ()=>this.props.history.replace('/') }>Fontopia</Typography>
        </div>
        <Tabs className="menu-tabs" aria-label="simple tabs example"
          value={ (current_tab_idx === -1) ? false : current_tab_idx } >
          <Tab label="Photo" onClick={ ()=>this.props.history.push('/photo/create') } />
          <Tab label="Article" onClick={ ()=>this.props.history.push('/article') } />
          <Tab label="Font" onClick={ ()=>this.props.history.push('/font') } />
          { logged_in && <Tab label="My page" onClick={ ()=>this.props.history.push('/my-page') } /> }
        </Tabs>
        { profile_area }
      </Toolbar></AppBar>);
  }
}

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  updateLogin: (data) => dispatch(updateLogin(data))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationBar));