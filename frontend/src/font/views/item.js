import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FontDetail from '../components/FontDetail';

class FontItemView extends Component {
  render() {
    return (
      <div className="font-detail-view">
        <button className="back"
          onClick={(e)=>this.props.history.goBack()}>Back</button>
        <FontDetail font_id={this.props.match.params.font_id} />
      </div>
    )
  }
};

export default withRouter(FontItemView);
