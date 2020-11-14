import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

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

    const items = this.state.list.map(f => {
      return <tr key={f.id}>
        <td className="name">
          <button onClick={(e)=>
            this.props.history.push(`/font/${f.id}`)}>
            {f.name}</button></td>
        <td className="manufacturer">{f.manufacturer_name}</td>
        <td className="license">{(f.license.is_free ?
          <span className="license-free">Free</span> : 
          <span className="license-nonfree">Proprietary ({f.license.type})</span>)}</td>
        <td className="viewcnt">{f.view_count}</td>
      </tr>
    });

    return <div className="font-list">
      <table className="font-list-table">
        <thead>
          <tr>
            <th className="name">Name</th>
            <th className="manufacturer">By</th>
            <th className="license">License</th>
            <th className="viewcnt">Views</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
      <PageButtonArray n={this.state.pages}
        cur={this.state.cur} onclick={(i)=>this.onBrowsePage(i)} />
    </div>
  }
};

export default withRouter(FontList);

