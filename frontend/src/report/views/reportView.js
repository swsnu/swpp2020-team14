import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FindingList from '../components/FindingList';
import PhotoReport from '../components/PhotoReport';

class ReportView extends Component {
  render() {
    return (
      <div className="report-view">
        <button
          className="back"
          onClick={() => this.props.history.replace(`/photo/${this.props.match.params.photo_id}`)}>
          Back
        </button>
        <PhotoReport photo_id={this.props.match.params.photo_id} />
        <FindingList photo_id={this.props.match.params.photo_id} />
      </div>
    );
  }
}
export default withRouter(ReportView);
