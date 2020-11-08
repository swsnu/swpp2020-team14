import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ArticleList from '../components/ArticleList';

class ArticleListView extends Component {
  render() {
    return (
      <div className="article-list-view">
        <ArticleList fetchEndpoint="/api/article" />
      </div>
    )
  }
}

export default withRouter(ArticleListView);

