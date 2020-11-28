import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PhotoList from '../components/PhotoList';

class PhotoListView extends Component {
  render() {
    return (
      <div className="photo-list-view">
        <PhotoList fetchEndpoint="/api/photo" isUploadAvailable isDeleteAvailable />
      </div>
    );
  }
}

export default withRouter(PhotoListView);
