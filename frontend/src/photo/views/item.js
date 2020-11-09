import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PhotoDetail from '../components/PhotoDetail';

class PhotoItemView extends Component {
  render() {
    return (
      <div className="photo-detail-view">
        <button className="back"
          onClick={(e)=>this.props.history.push("/my-page/photo")}>Back</button>
        <PhotoDetail photo_id={this.props.match.params.photo_id} />
      </div>
    )
  }
};

export default withRouter(PhotoItemView);
