import { Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FontList from '../components/FontList';

import './list.css';

class FontListView extends Component {
  render() {
    return (
    <>
      <div className="font-list-wrapper font-list-hot">
        <Typography variant="h3">
          Most Viewed
        </Typography>
        <FontList
          noPaging
          fetchEndpoint="/api/font/most-viewed"
        />
      </div>
      <div className="font-list-wrapper font-list-all">
        <Typography variant="h3">
          All Fonts
        </Typography>
        <FontList fetchEndpoint="/api/font"/>
      </div>
    </>
    );
  }
}

export default withRouter(FontListView);
