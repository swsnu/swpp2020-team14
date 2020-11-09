import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import PageButtonArray from '../../common/pagination';

import './ArticleList.css';

class ArticleList extends Component {
  state = {
    list: null,
    pages: -1,  // number of pages
    cur: -1,    // current page
  }

  onInit() {
    this.onBrowsePage(1);
  }

  onBrowsePage(n) {
    this.setState({list: null});
    axios.get(`${this.props.fetchEndpoint}?page=${n}`)
      .then((resp) => {
        this.setState({
          list: resp.data.list,
          pages: resp.data.pages,
          cur: resp.data.cur
        });
      })
      .catch((err) => {
        alert("Error loading article list: " + err);
      });
  }

  componentDidMount() {
    this.onInit();
  }

  render() {
    if (this.state.list === null) {
      return <p className="loading">Loading article list...</p>
    }

    const items = this.state.list.map(a => {
      const title_btn = (a.comment_count > 0 ?
        (<button onClick={(e)=>this.props.history.push(`/article/${a.id}`)}>
            <b>{a.title}</b> [{a.comment_count}]
        </button>) :
        (<button onClick={(e)=>this.props.history.push(`/article/${a.id}`)}>
          {a.title}
        </button>));
      return <tr key={a.id}>
        <td className="id">{a.id}</td>
        <td className="title">{title_btn}</td>
        <td className="author">{a.author}</td>
      </tr>
    });

    return <div className="article-list">
      <table className="article-list-table">
        <thead>
          <tr>
            <th className="id">#</th>
            <th className="title">Title</th>
            <th className="author">Author</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
      <PageButtonArray n={this.state.pages}
        cur={this.state.cur} onclick={(i)=>this.onBrowsePage(i)} />
    </div>
  }
}

export default withRouter(ArticleList);

