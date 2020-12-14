import React, { Component } from 'react';

import axios from 'axios';

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
      <div className="name">
        <h3>Font Name</h3>
        <p>{f.name}</p>
      </div>

      <div className="manufacturer">
        <h3>Manufacturer</h3>
        <p>{f.manufacturer_name}</p>
      </div>

      <div className="license">
        <h3>License</h3>
        <div className={f.license.is_free ?
          "license-free" : "license-nonfree"}>
          <p>{f.license.is_free ?
            "Free" : "Non-free"}</p>
          <FontLicenseDetail license={f.license} />
        </div>
      </div>
    </div>
    );
  }
}

export default FontDetail;
