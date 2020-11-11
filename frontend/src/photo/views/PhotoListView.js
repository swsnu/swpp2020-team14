import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PhotoList from '../components/PhotoList';

class PhotoListView extends Component {
  render() {
    return (
      <div className="photo-list-view">
        <PhotoList fetchEndPoint="api/photo" isUploadAvailabe={true} isDeleteAvailabe={true}/>
      </div>
    )
  }
};

export default withRouter(PhotoListView);
