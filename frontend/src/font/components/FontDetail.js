import React, { Component } from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';

import axios from 'axios';

import FontItem from './FontItem';

import './FontDetail.css';

class FontLicenseDetail extends Component {
  render() {
    return (
      <div className="license-detail">
        {this.props.license.license_detail}
      </div>
    );
  }
}

class FontDetail extends Component {
  state = {
    data: null
  }

  onInit() {
    axios.get(`/api/font/${this.props.font_id}`)
      .then((resp) => {
        this.setState({data: resp.data});
      })
      .catch((err) => {
        alert(err);
        this.props.history.goBack();
      });
  }

  componentDidMount() {
    this.onInit();
  }

  render() {
    if (this.state.data === null) {
      return <p>Loading font detail...</p>;
    }

    const f = this.state.data;

    const similar_content = ((f.similars === undefined) ?
      <Typography>
        Please sign in to see all similar fonts.
      </Typography> :
      <div className="similars-list">
        { f.similars.map(g => <FontItem key={g.id} font={g} />) }
      </div>
    );

    return (<div className="font-detail">
      <Grid container className="font-name-row" justify="space-between" alignItems="center">
        <Typography className="font-name" variant="h3">{f.name}</Typography>
        <Typography className="view-count" variant="h5" color="textSecondary">
          View: { f.view_count }
        </Typography>
      </Grid>
      <div className="font-sample-row">
        <img
          className="font-sample"
          src={`/static/font-samples/${f.name}.png`} />
      </div>
      <div className="section">
        <Typography className="section-header" variant="h4">Manufacturer</Typography>
        <div>
          <Typography className="section-body" variant="h5">
            { f.manufacturer_name }
          </Typography>
        </div>
      </div>

      <Divider />

      <div className="section">
        <Typography className="section-header" variant="h4">License</Typography>
        <div>
          <Typography className="section-body" variant="h5">
            <div className={f.license.is_free ?
              "license-free" : "license-nonfree"}>
              <Typography variant="p">{f.license.is_free ?
                "Free" : "Non-free"}</Typography>
              <FontLicenseDetail license={f.license} />
            </div>
          </Typography>
        </div>
      </div>

      <Divider />

      <div className="section">
        <Typography className="section-header" variant="h4">Similar Fonts</Typography>
        <div>
          { similar_content }
        </div>
      </div>
    </div>
    );
  }
}

export default FontDetail;
