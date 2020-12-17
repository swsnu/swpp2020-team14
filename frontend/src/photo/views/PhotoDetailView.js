import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PhotoDetail from '../components/PhotoDetail';

class PhotoDetailView extends Component {
  render() {
    return (
      <div className="photo-detail-view">
        <button
          className="back"
          onClick={(e) => this.props.history.goBack()}
        >
          Back
        </button>
        <PhotoDetail photo_id={this.props.match.params.photo_id} />
      </div>
    );
  }
}

export default withRouter(PhotoDetailView);
