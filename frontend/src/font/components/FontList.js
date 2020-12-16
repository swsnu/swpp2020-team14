import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import FontItem from './FontItem';
import PageButtonArray from '../../common/pagination';

import './FontList.css';

class FontList extends Component {
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
    axios.get(`/api/font?page=${n}`)
      .then((resp) => {
        this.setState({
          list: resp.data.list,
          pages: resp.data.pages,
          cur: resp.data.cur
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  componentDidMount() {
    this.onInit();
  }

  render() {
    if (this.state.list === null) {
      return <p className="loading">Loading font list...</p>
    }

    const items = this.state.list.map(f => <FontItem key={f.id} font={f} />);

    return <div className="font-list">
      {items}
      <PageButtonArray n={this.state.pages}
        cur={this.state.cur} onclick={(i)=>this.onBrowsePage(i)} />
    </div>
  }
}

export default withRouter(FontList);

