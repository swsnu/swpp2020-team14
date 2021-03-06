import React from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  ArticleDetailView, ArticleListView, ArticleCreateView, ArticleEditView,
} from './article/views/all.js';
import { FontListView, FontItemView } from './font/views/all.js';
import { PhotoListView, PhotoDetailView, PhotoCreateView } from './photo/views/all.js';
import MyPageView from './mypage/views/mypage.js';
import ReportView from './report/views/reportView.js';
import { SignupView, SigninView } from './sign/views/all';
import NavigationBar from './common/NavigationBar';

import './App.css';
import { Container } from '@material-ui/core';
import MainpageView from './mainpage/views/MainpageView.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

function App(props) {
  const AuthorizedRoute = ({ component, ...rest }) => {
    if (props.login.logged_in === true) {
      return <Route {...rest} component={component} />;
    }
    return <Redirect to="/signin" />;
  };

  const UnauthorizedRoute = ({ component, ...rest }) => {
    if (props.login.logged_in === false) {
      return <Route {...rest} component={component} />;
    }
    return <Redirect to="/" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Container className="content" maxWidth="md">
          <Switch>
            <Route exact path="/" component={ MainpageView } />

            <Route exact path="/article" component={ArticleListView} />
            <AuthorizedRoute exact path="/article/create" component={ArticleCreateView} />
            <Route exact path="/article/:article_id" component={ArticleDetailView} />
            <AuthorizedRoute exact path="/article/:article_id/edit" component={ArticleEditView} />
            <Route exact path="/font" component={FontListView} />
            <Route exact path="/font/:font_id" component={FontItemView} />

            <AuthorizedRoute exact path="/my-page" component={MyPageView} />
            <AuthorizedRoute exact path="/my-page/photo" component={PhotoListView} />
            <Route exact path="/photo/create" component={PhotoCreateView} />
            <Route exact path="/photo/:photo_id" component={PhotoDetailView} />

            <UnauthorizedRoute exact path="/signin" component={SigninView} />
            <UnauthorizedRoute exact path="/signup" component={SignupView} />

            <Redirect from="*" to="/" />
          </Switch>
        </Container>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => ({
  login: state.login,
});

export default connect(mapStateToProps)(App);
