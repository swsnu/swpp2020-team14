import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { ArticleDetailView, ArticleListView, ArticleCreateView, ArticleEditView } from './article/views/all.js';
import { FontListView, FontItemView } from './font/views/all.js';

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
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
