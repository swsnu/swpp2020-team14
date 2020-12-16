import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import axios from 'axios';

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
    return (<div className="font-detail">
      <Grid container className="row row-name">
        <Grid item xs={4}>
          <h3>Font Name</h3>
        </Grid>
        <Grid item xs={8}>
          <p>{f.name}</p>
        </Grid>
      </Grid>

      <Grid container className="row row-manufacturer">
        <Grid item xs={4}>
          <h3>Manufacturer</h3>
          </Grid>
          <Grid item xs={8}>
          <p>{f.manufacturer_name}</p>
        </Grid>
      </Grid>

      <Grid container className="row row-sample">
        <Grid item xs={4}>
          <h3>Sample</h3>
        </Grid>
        <Grid item xs={8}>
          <img src={`/static/font-samples/${f.name}.png`} />
        </Grid>
      </Grid>


      <Grid container className="row row-license">
        <Grid item xs={4}>
          <h3>License</h3>
        </Grid>
        <Grid item xs={8}>
          <div className={f.license.is_free ?
            "license-free" : "license-nonfree"}>
            <p>{f.license.is_free ?
              "Free" : "Non-free"}</p>
            <FontLicenseDetail license={f.license} />
          </div>
        </Grid>
      </Grid>
    </div>
    );
  }
}

export default FontDetail;
