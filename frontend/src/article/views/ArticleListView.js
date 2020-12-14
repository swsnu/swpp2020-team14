import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';

import ArticleList from '../components/ArticleList';

import './ArticleListView.css';

class ArticleListView extends Component {
  render() {
    return (
      <div className="article-list-view">
        <div className="row-create">
          <Button
            onClick={() => this.props.history.push('/article/create')}
            variant="contained"
            color="secondary"
          >
            New article
          </Button>
        </div>
        <ArticleList fetchEndpoint="/api/article" />
      </div>
    );
  }
}

export default withRouter(ArticleListView);
