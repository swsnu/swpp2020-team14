import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FontList from '../components/FontList';

class FontListView extends Component {
  render() {
    return (
      <div className="font-list-view">
        <FontList />
      </div>
    )
  }
};

export default withRouter(FontListView);
