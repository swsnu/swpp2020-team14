import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ArticleEdit from '../components/ArticleEdit';

class ArticleCreateView extends Component {
  render() {
    return <ArticleEdit originalId={-1} />;
  }
}

export default withRouter(ArticleCreateView);
