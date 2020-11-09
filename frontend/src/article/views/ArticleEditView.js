import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ArticleEdit from '../components/ArticleEdit';

class ArticleEditView extends Component {
  render() {
    return <ArticleEdit originalId={this.props.match.params.article_id} />;
  }
}

export default withRouter(ArticleEditView);
