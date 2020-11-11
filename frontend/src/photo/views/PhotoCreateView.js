import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PhotoEdit from '../components/PhotoEdit';

class PhotoCreateView extends Component {
  render() {
    return <PhotoEdit originalId={-1} />;
  }
}

export default withRouter(PhotoCreateView);
