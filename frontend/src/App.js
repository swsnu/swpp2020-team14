import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { ArticleDetailView, ArticleListView, ArticleCreateView, ArticleEditView } from './article/views/all.js';
import { FontListView, FontItemView } from './font/views/all.js';
import { PhotoListView, PhotoItemView, PhotoCreateView } from './photo/views/all.js';
import MyPageView from './mypage/views/mypage.js';
import ReportView from './report/views/reportView.js';
import Signup from './sign/components/signup';
import Signin from './sign/components/signin';

import './App.css';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="navbar">
        </div>
        <Switch>
          <Route exact path="/article" component={ArticleListView} />
          <Route exact path="/article/create" component={ArticleCreateView} />
          <Route exact path="/article/:article_id" component={ArticleDetailView} />
          <Route exact path="/article/:article_id/edit" component={ArticleEditView} />
          <Route exact path="/font" component={FontListView} />
          <Route exact path="/font/:font_id" component={FontItemView} />
          <Route exact path="/my-page" component={MyPageView} />
          <Route exact path="/my-page/photo" component={PhotoListView} />
          <Route exact path="/my-page/photo/create" component={PhotoCreateView} />
          <Route exact path="/my-page/photo/:photo_id" component={PhotoItemView} />
          <Route exact path="/my-page/photo/:photo_id/report" component={ReportView} />
          <Route exact path="/font/:font_id" component={FontItemView} />
          <Route exact path="/font" component={FontListView} />          
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Signin} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
