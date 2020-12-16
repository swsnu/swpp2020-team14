import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Paper, Typography } from '@material-ui/core';

import PhotoCreate from '../components/PhotoCreate';

import './PhotoCreateView.css';

class PhotoCreateView extends Component {
  render() {
    return (
      <Paper className="photo-create-wrapper">
        <Typography variant="h4">
          Font recognition
        </Typography>
        <PhotoCreate originalId={-1} />
      </Paper>
    );
  }
}

export default withRouter(PhotoCreateView);
