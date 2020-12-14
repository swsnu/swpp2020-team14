import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ArticleDetail from '../components/ArticleDetail';

class ArticleDetailView extends Component {
  render() {
    return (
      <div className="article-detail-view">
        <button
          className="back"
          onClick={(e) => this.props.history.goBack()}
        >
          Back
        </button>
        <ArticleDetail article_id={this.props.match.params.article_id} />
      </div>
    );
  }
}

export default withRouter(ArticleDetailView);
