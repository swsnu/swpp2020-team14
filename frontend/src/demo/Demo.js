import React, { Component } from 'react';
import axios from 'axios';

import './Demo.css';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: false,
      result: null,
      sending: false,
      error: null,
    };
    this.imageFile = React.createRef();
  }

  onImageChange() {
    if (!this.imageFile.current.files.length) {
      this.setState({ chosen: false });
      return;
    }
    this.setState({ chosen: true, sending: true, result: null });
    (async () => {
      await axios.get('/api/token');
      const fd = new FormData();
      fd.append('image', this.imageFile.current.files[0]);
      const resp = await axios.post('/api/demo', fd);
      if (resp.data.success !== true) {
        throw new Error(resp.data.error);
      }
      this.setState({ result: resp.data.result });
    })()
    .catch((err) => {
      if (err.response) {
        this.setState({ error: err.response.data });
      } else if (err.message) {
        this.setState({ error: err.message });
      } else {
        this.setState({ error: "알 수 없는 오류가 발생했습니다." });
      }
    }).finally(() => {
      this.setState({ sending: false });
    });
  }

  render() {
    const results = (this.state.result !== null && <table className="table-result"><tbody>
      { this.state.result.map((x, i) => {
        return (<tr key={ i }>
          <td className="font">{ x.font }</td>
          <td className="prob"
          style={{ background: `rgba(180, 150, 150, ${5+x.prob*50}%)`}}
          >{ (x.prob*100).toFixed(2) }%</td>
        </tr>);
      }) }</tbody></table>
    );

    return (
      <div className="demo-wrapper">
        <div className="demo">
          <div className="input-area">
            <button className="btn-clear"
              onClick={(e) => {
                this.imageFile.current.value = null;
                this.setState({ chosen: false, error: null, result: null }); }}>Clear</button>
            <label className={"preview " + (this.state.chosen ? "chosen" : "not-chosen")}>
              { this.state.chosen ?
                <img src={ URL.createObjectURL(this.imageFile.current.files[0]) } alt="uploading" /> :
                <span className="msg-no-image">Click here to upload</span>
              }
              <input className="input" onChange={() => this.onImageChange()} disabled={this.state.sending}
                  type="file" accept="image/jpeg,image/png" ref={this.imageFile} />
            </label>
            { this.state.error !== null &&
            <div className="error-msg">
              <span className="icon">&#x26a0;&nbsp;</span>
              <span className="msg">{ this.state.error }</span>
            </div>}
          </div>
          <div className="results">
            { results }
          </div>
          {this.state.sending &&
            <div className="blocker">
              <div className="block-message">
                <p>전송 중입니다.</p>
                <p>잠시만 기다려 주세요.</p>
              </div>
            </div>}
        </div>
      </div>
    );
  }
}

export default Demo;