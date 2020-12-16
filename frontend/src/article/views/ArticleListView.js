import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Paper, Typography } from '@material-ui/core';

import ArticleList from '../components/ArticleList';

import './ArticleListView.css';

class ArticleListView extends Component {
  render() {
    return (
      <Paper className="article-list-view">
        <Typography variant="h4">Recent Articles</Typography>
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
      </Paper>
    );
  }
}

export default withRouter(ArticleListView);
